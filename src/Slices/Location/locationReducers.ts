import { createAsyncThunk } from '@reduxjs/toolkit';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import { Subject } from 'proto-all-js/domain/domain_pb';
import {
  GetLocationHistoryRequest,
  LocationHistory,
} from 'proto-all-js/location/service_pb';
import { LocationApi } from 'proto-all-js/location/service_pb_service';
import { getQueryRange, Interval } from '../utils/cache';
import { grpcUnaryRequest } from '../utils/grpc';
import RootState from '../utils/RootState';

interface GetLocationRecordsRequest {
  ids: number[];
  timeFrame: Interval;

  namespaceId: number;
}

interface GetLocationRecordsResponse {
  map: Array<[number, LocationHistory.AsObject]>;
  range: Interval;
}

export const getLocationRecords = createAsyncThunk<
  GetLocationRecordsResponse[],
  GetLocationRecordsRequest,
  { rejectValue: string; state: RootState }
>('location/getRecords', async (params, thunkAPI) => {
  const { ids, timeFrame, namespaceId } = params;

  if (ids.length === 0) {
    return thunkAPI.rejectWithValue('Empty array.');
  }

  try {
    const requests: GetLocationHistoryRequest[] = [];

    ids.forEach((id) => {
      const cachedData = thunkAPI.getState().location.cache[id];

      const queryRange = getQueryRange(timeFrame, cachedData);

      if (queryRange !== null) {
        queryRange.forEach((range) => {
          const existingRequest = requests.find((req) => {
            const { fromTime, toTime } = req.toObject();

            return (
              fromTime &&
              toTime &&
              fromTime.seconds === range.start.getTime() / 1000 &&
              toTime.seconds === range.end.getTime() / 1000
            );
          });

          const subject = new Subject();
          subject.setId(id);
          subject.setNamespace(namespaceId);

          if (existingRequest) {
            existingRequest.addSubjects(subject);

            return;
          }

          const newRequest = new GetLocationHistoryRequest();

          newRequest.setFromTime(Timestamp.fromDate(range.start));
          newRequest.setToTime(Timestamp.fromDate(range.end));

          newRequest.addSubjects(subject);

          requests.push(newRequest);
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

const formGrpcRequests = (requests: GetLocationHistoryRequest[]) => {
  const grpcRequests = requests.map((request) => {
    return new Promise<GetLocationRecordsResponse>(async (resolve, reject) => {
      try {
        const response = await grpcUnaryRequest(
          LocationApi.GetLocationHistory,
          request
        );
        const { subjectLocationHistoryMap } = response.toObject();
        const { fromTime, toTime } = {
          fromTime: request.getFromTime()?.toObject().seconds,
          toTime: request.getToTime()?.toObject().seconds,
        };

        if (fromTime && toTime) {
          resolve({
            map: subjectLocationHistoryMap,
            range: {
              start: new Date(fromTime * 1000),
              end: new Date(toTime * 1000),
            },
          });
        } else {
          reject('Error');
        }
      } catch (err) {
        reject(`Spotsie cloud error: ${err}`);
      }
    });
  });

  return grpcRequests;
};
