import { PromiseClient } from "@bufbuild/connect-web";
import { Timestamp } from "@bufbuild/protobuf";
import { PlainMessage } from "@bufbuild/protobuf";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Subject } from "@spotsie/proto/domain/v1/domain_pb";
import { LocationService } from "@spotsie/proto/location/v1/service_connectweb";
import {
  GetLatestSubjectLocationResponse,
  GetLocationHistoryRequest,
  GetSubjectLocationsAtResponse,
  LocationHistory,
} from "@spotsie/proto/location/v1/service_pb";
import { getQueryRange, Interval } from "../utils/cache";
import { ThunkAPI } from "../utils/store";

interface GetLocationRecordsRequest {
  ids: number[];
  timeFrame: Interval;
}

interface GetLocationRecordsResponse {
  map: { [key: number]: PlainMessage<LocationHistory> };
  range: Interval;
}

export const getLocationRecords = createAsyncThunk<
  GetLocationRecordsResponse[],
  GetLocationRecordsRequest,
  ThunkAPI
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
                Number(Timestamp.fromDate(range.start).seconds) &&
              Number(toTime.seconds) ===
                Number(Timestamp.fromDate(range.end).seconds)
            );
          });

          const subject: PlainMessage<Subject> = {
            id,
            namespace: thunkAPI.extra.namespaceId,
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

    const grpcRequests = formGrpcRequests(
      requests,
      thunkAPI.extra.LocationClient
    );

    const grpcResponses = await Promise.all(grpcRequests);

    return grpcResponses;
  } catch (err) {
    return thunkAPI.rejectWithValue((err as any).msg);
  }
});

export type GetLatestSubjectLocationRequest = {
  subjects: number[];
  fromTime: Date;
};

export const getLatestSubjectLocation = createAsyncThunk<
  GetLatestSubjectLocationResponse,
  GetLatestSubjectLocationRequest,
  ThunkAPI
>("location/getLatestSubjectLocation", async (request, thunkApi) => {
  try {
    const response =
      await thunkApi.extra.LocationClient.getLatestSubjectLocation({
        subjects: request.subjects.map((id) => ({
          id,
          namespace: thunkApi.extra.namespaceId,
        })),
        fromTime: request.fromTime
          ? Timestamp.fromDate(request.fromTime)
          : undefined,
      });

    return response;
  } catch (err) {
    return thunkApi.rejectWithValue(err as any);
  }
});

export const getSubjectLocationsAt = createAsyncThunk<
  GetSubjectLocationsAtResponse,
  { time: Date },
  ThunkAPI
>("location/getSubjectLocationsAt", async (request, thunkApi) => {
  try {
    const response = await thunkApi.extra.LocationClient.getSubjectLocationsAt({
      namespace: thunkApi.extra.namespaceId,
      time: Timestamp.fromDate(request.time),
    });

    return response;
  } catch (err) {
    return thunkApi.rejectWithValue(err as any);
  }
});

const formGrpcRequests = (
  requests: PlainMessage<GetLocationHistoryRequest>[],
  LocationClient: PromiseClient<typeof LocationService>
) => {
  const grpcRequests = requests.map((request) => {
    return new Promise<GetLocationRecordsResponse>(async (resolve, reject) => {
      try {
        const response = await LocationClient.getLocationHistory(request);
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
