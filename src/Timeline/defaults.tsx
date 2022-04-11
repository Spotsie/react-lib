import { LocationHistoryRecord } from 'proto-all-js/location/location_pb';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import { ReactNode } from 'react';
import React from 'react';
import { Zone } from 'proto-all-js/deployment/organization_pb';

export const colors: string[] = [
  '#f6ad55',
  '#81e6d9',
  '#b794f4',
  '#63b3ed',
  '#68d391',
  '#fc8181',
  '#ecc94b',
  '#d53f8c',
];

export const zoneIds: Zone.AsObject[] = [
  {
    id: 1,
    config: {
      name: 'First',
      geoJson: '',
      positioningReferentsList: [],
      deploymentId: 1,
    },
  },
  {
    id: 2,
    config: {
      name: 'Second',
      geoJson: '',
      positioningReferentsList: [],
      deploymentId: 1,
    },
  },
  {
    id: 3,
    config: {
      name: 'Third',
      geoJson: '',
      positioningReferentsList: [],
      deploymentId: 1,
    },
  },
  {
    id: 4,
    config: {
      name: 'Fourth',
      geoJson: '',
      positioningReferentsList: [],
      deploymentId: 1,
    },
  },
];

export const timeFrame = {
  start: new Date(2021, 1, 1, 8, 0, 0),
  end: new Date(2021, 1, 1, 10, 40),
};

export const timelineData: { [id: number]: LocationHistoryRecord.AsObject[] } =
  {
    1: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 0, 8, 0, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 16, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23, 0)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 23, 10)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 0)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 5)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 55, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 9, 10, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 1,
      },
    ],

    2: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15)).toObject(),
        zone: 4,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 17)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 25)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 11)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 3,
      },
    ],

    3: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 0, 8, 0, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 16, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23, 0)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 23, 10)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 0)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 5)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 55, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 9, 10, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 1,
      },
    ],

    4: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15)).toObject(),
        zone: 4,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 17)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 25)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 11)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 3,
      },
    ],

    5: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 0, 8, 0, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 16, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23, 0)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 23, 10)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 0)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 5)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 55, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 9, 10, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 1,
      },
    ],

    6: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15)).toObject(),
        zone: 4,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 17)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 25)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 11)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 3,
      },
    ],

    7: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 0, 8, 0, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 16, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23, 0)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 23, 10)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 0)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 5)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 55, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 9, 10, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 1,
      },
    ],

    8: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15)).toObject(),
        zone: 4,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 17)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 25)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 11)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 3,
      },
    ],

    9: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 0, 8, 0, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 16, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23, 0)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 23, 10)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 0)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 5)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 55, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 9, 10, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 1,
      },
    ],

    10: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15)).toObject(),
        zone: 4,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 17)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 25)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 11)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 3,
      },
    ],

    11: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 0, 8, 0, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 16, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23, 0)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 23, 10)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 0)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 5)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 55, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 9, 10, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 1,
      },
    ],

    12: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15)).toObject(),
        zone: 4,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 17)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 25)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 11)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 3,
      },
    ],

    13: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 0, 8, 0, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 16, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23, 0)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 23, 10)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 0)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 5)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 55, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 9, 10, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 1,
      },
    ],

    14: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15)).toObject(),
        zone: 4,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 17)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 25)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 11)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 3,
      },
    ],

    15: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 0, 8, 0, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 16, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23, 0)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 23, 10)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 0)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40, 5)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55, 0)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 8, 55, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(
          new Date(2021, 1, 1, 9, 10, 20)
        ).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 1,
      },
    ],

    16: [
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 0)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 15)).toObject(),
        zone: 4,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 17)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 23)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 25)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        zone: 3,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 40)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        zone: 2,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 8, 55)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 10)).toObject(),
        zone: 1,
      },
      {
        fromTime: Timestamp.fromDate(new Date(2021, 1, 1, 9, 11)).toObject(),
        toTime: Timestamp.fromDate(new Date(2021, 1, 1, 10, 40)).toObject(),
        zone: 3,
      },
    ],
  };

export const labels: { [id: number]: ReactNode } = Object.keys(
  timelineData
).reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: (
      <div
        style={{
          fontFamily: 'Helvetica',
          color: 'black',
          fontWeight: 700,
          fontSize: '0.875rem',
        }}
      >
        {curr}
      </div>
    ),
  }),
  {}
);
