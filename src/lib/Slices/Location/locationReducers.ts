import { Timestamp } from "@bufbuild/protobuf";
import { PlainMessage } from "@bufbuild/protobuf";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Subject } from "proto/domain/v1/domain_pb";
import {
  GetLocationHistoryRequest,
  LocationHistory,
} from "proto/location/v1/service_pb";
import { API_NAMESPACE_ID } from "../../utils/constants";
import { getQueryRange, Interval } from "../utils/cache";
import { headers, LocationClient } from "../utils/grpc";
import RootState from "../utils/RootState";

interface GetLocationRecordsRequest {
  ids: number[];
  timeFrame: Interval;
}

interface GetLocationRecordsResponse {
  map: { [key: number]: LocationHistory };
  range: Interval;
}

export const getLocationRecords = createAsyncThunk<
  GetLocationRecordsResponse[],
  GetLocationRecordsRequest,
  { rejectValue: string; state: RootState }
>("location/getRecords", async (params, thunkAPI) => {
  const { ids, timeFrame } = params;

  if (ids.length === 0) {
    return [];
  }

  try {
    const requests: PlainMessage<GetLocationHistoryRequest>[] = [];

    ids.forEach((id) => {
      const cachedData = thunkAPI.getState().location.cache[id];

      const queryRange = getQueryRange(timeFrame, cachedData);

      if (queryRange !== null) {
        queryRange.forEach((range) => {
          const existingRequest = requests.find((req) => {
            const { fromTime, toTime } = req;
            if (!fromTime || !toTime) {
              return false;
            }

            return (
              Number(fromTime.seconds) ===
                Math.floor(range.start.getTime() / 1000) &&
              Number(toTime?.seconds) === Math.floor(range.end.getTime() / 1000)
            );
          });

          const subject: PlainMessage<Subject> = {
            id,
            namespace: API_NAMESPACE_ID,
          };

          if (existingRequest) {
            existingRequest.subjects?.push(subject);

            return;
          }

          const newRequest: PlainMessage<GetLocationHistoryRequest> = {
            subjects: [subject],
            fromTime: Timestamp.fromDate(range.start),
            toTime: Timestamp.fromDate(range.end),
          };

          requests.push(newRequest as any);
        });
      }
    });

    if (requests.length === 0) {
      return [];
    }

    const grpcRequests = formGrpcRequests(requests);

    const grpcResponses = await Promise.all(grpcRequests);

    return grpcResponses;
  } catch (err) {
    return thunkAPI.rejectWithValue((err as any).msg);
  }
});

const formGrpcRequests = (
  requests: PlainMessage<GetLocationHistoryRequest>[]
) => {
  const grpcRequests = requests.map((request) => {
    return new Promise<GetLocationRecordsResponse>(async (resolve, reject) => {
      try {
        const response = await LocationClient.getLocationHistory(request, {
          headers,
        });
        const { subjectLocationHistory } = response;
        const { fromTime, toTime } = {
          fromTime: Number(request.fromTime?.seconds),
          toTime: Number(request.fromTime?.seconds),
        };

        if (fromTime && toTime) {
          resolve({
            map: subjectLocationHistory,
            range: {
              start: new Date(fromTime * 1000),
              end: new Date(toTime * 1000),
            },
          });
        } else {
          reject("Error");
        }
      } catch (err) {
        reject(`Spotsie cloud error: ${err}`);
      }
    });
  });

  return grpcRequests;
};
