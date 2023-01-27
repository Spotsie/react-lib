import { ReactNode } from "react";
import React from "react";
import { Zone } from "@spotsie/proto/deployment/v1/organization_pb";
// import * as timelineDataJson from './timelineData.json';
// import * as zoneData from './zoneData.json';
import { LocationHistory } from "@spotsie/proto/location/v1/service_pb";
import { LocationHistoryRecord } from "@spotsie/proto/location/v1/location_pb";
import { PlainMessage } from "@bufbuild/protobuf";

// const timelineData: Array<[number, LocationHistory.AsObject]> = (
//   timelineDataJson as any
// ).default;
const timelineData: Array<[number, PlainMessage<LocationHistory>]> = [];

// export const zoneIds: Zone.AsObject[] = (zoneData as any).default;
export const zoneIds: PlainMessage<Zone>[] = [];

export const colors: string[] = [
  "#f6ad55",
  "#81e6d9",
  "#b794f4",
  "#63b3ed",
  "#68d391",
  "#fc8181",
  "#ecc94b",
  "#d53f8c",
  "#f6ad55",
  "#81e6d9",
  "#b794f4",
  "#63b3ed",
  "#68d391",
  "#fc8181",
  "#ecc94b",
  "#d53f8c",
  "#f6ad55",
  "#81e6d9",
  "#b794f4",
  "#63b3ed",
  "#68d391",
  "#fc8181",
  "#ecc94b",
  "#d53f8c",
  "#f6ad55",
  "#81e6d9",
  "#b794f4",
  "#63b3ed",
  "#68d391",
  "#fc8181",
  "#ecc94b",
  "#d53f8c",
];

export const timeFrame = {
  start: new Date(2022, 2, 29),
  end: new Date(2022, 3, 2),
};

export const getTimelineData = (timeFrame: {
  start: number;
  end: number;
}): {
  [id: number]: PlainMessage<LocationHistoryRecord>[];
} =>
  timelineData.reduce(
    (obj, [subjectId, { records }]) => ({
      ...obj,
      [subjectId]: records.filter(
        ({ fromTime, toTime }) =>
          fromTime &&
          toTime &&
          fromTime.seconds >= timeFrame.start &&
          toTime.seconds <= timeFrame.end
      ),
    }),
    {}
  );

export const labels: { [id: number]: ReactNode } = Object.keys(
  timelineData
).reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: (
      <div
        style={{
          fontFamily: "Helvetica",
          color: "black",
          fontWeight: 700,
          fontSize: "0.875rem",
        }}
      >
        {curr}
      </div>
    ),
  }),
  {}
);
