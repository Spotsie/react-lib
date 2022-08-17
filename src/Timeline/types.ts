import { Zone } from 'proto-all-js/deployment/organization_pb';
import { LocationHistoryRecord } from 'proto-all-js/location/location_pb';
import { CSSProperties, ReactNode } from 'react';

export type TooltipData = {
  duration: number;
  point: { x: number; y: number };
  zone: Zone.AsObject;
};

export type MarkerBreakpoint = {
  minScale: number;
  interval: Duration;
  timeFormat: string;
};

export type TimelineProps = {
  timeFrame: { start: Date; end: Date };
  timelineData: { [id: number]: LocationHistoryRecord.AsObject[] };
  labels: { [id: number]: ReactNode };

  zoomSensitivity?: number;

  trackHeight?: number;
  trackGap?: number;
  trackTopOffset?: number;

  colors: string[];
  zoneIds: Zone.AsObject[];

  selectedZone: number | null;

  onClickZone?(zoneId: number): void;

  onScroll?(timeFrame: { start?: Date; end?: Date }): void;

  style?: CSSProperties;
};

export type TimelineCanvasProps = {
  timeFrame: { start: Date; end: Date };
  timelineData: { [id: number]: LocationHistoryRecord.AsObject[] };

  zoomSensitivity: number;

  trackHeight: number;
  trackGap: number;
  trackTopOffset: number;

  colors: string[];
  zoneIds: Zone.AsObject[];

  selectedZone: number | null;

  onClickZone?(zoneId: number): void;

  onScroll?(timeFrame: { start?: Date; end?: Date }): void;
};

export type TimelineTrackProps = {
  locationRecords: { [id: number]: LocationHistoryRecord.AsObject[] };

  trackHeight: number;
  trackGap: number;
  topOffset: number;

  colors: string[];
  zoneIds: Zone.AsObject[];

  selectedZone: number | null;

  onClickZone?(zoneId: number | null): void;
};
