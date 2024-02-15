import { Zone } from "@spotsie/proto/deployment/v1/organization_pb";
import { LocationHistoryRecord } from "@spotsie/proto/location/v1/location_pb";
import { CSSProperties, ReactNode } from "react";
import { PlainMessage } from "@bufbuild/protobuf";

export type TooltipData = {
  duration: number;
  point: { x: number; y: number };
  zone: PlainMessage<Zone>;
};

export type MarkerBreakpoint = {
  minScale: number;
  interval: Duration;
  showSeconds: boolean;
};

export type TimelineProps = {
  timeFrame: { start: Date; end: Date };
  timelineData: { [id: number]: PlainMessage<LocationHistoryRecord>[] };
  labels: { [id: number]: ReactNode };

  zoomSensitivity?: number;

  trackHeight?: number;
  trackGap?: number;
  trackTopOffset?: number;

  colors: string[];
  zoneIds: PlainMessage<Zone>[];

  selectedZone: number | null;

  onClickZone?(zoneId: number): void;

  onScroll?(timeFrame: { start?: Date; end?: Date }): void;

  style?: CSSProperties;

  leftMarginInRem?: number;
  locale?: "en" | "hr";
};

export type TimelineCanvasProps = {
  timeFrame: { start: Date; end: Date };
  timelineData: { [id: number]: PlainMessage<LocationHistoryRecord>[] };

  zoomSensitivity: number;

  trackHeight: number;
  trackGap: number;
  trackTopOffset: number;

  colors: string[];
  zoneIds: PlainMessage<Zone>[];

  selectedZone: number | null;

  onClickZone?(zoneId: number): void;

  onScroll?(timeFrame: { start?: Date; end?: Date }): void;

  leftMarginInRem: number;
  locale: "en" | "hr";
};

export type TimelineTrackProps = {
  locationRecords: { [id: number]: PlainMessage<LocationHistoryRecord>[] };

  trackHeight: number;
  trackGap: number;
  topOffset: number;

  colors: string[];
  zoneIds: PlainMessage<Zone>[];

  selectedZone: number | null;

  onClickZone?(zoneId: number | null): void;
};
