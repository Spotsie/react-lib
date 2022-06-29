import { Zone } from 'proto-all-js/deployment/organization_pb';
import { LocationHistoryRecord } from 'proto-all-js/location/location_pb';
import { CSSProperties, ReactNode } from 'react';
import { LineDashedMaterial } from 'three';

export interface TimelineProps {
  timeFrame: { start: Date; end: Date };
  timelineData: { [id: number]: LocationHistoryRecord.AsObject[] };
  labels: { [id: number]: ReactNode };

  zoomSensitivity?: number;

  timeMarkerStyle?: Partial<LineDashedMaterial>;
  timeMarkerLabelStyle?: CSSProperties;
  dateMarkerStyle?: Partial<LineDashedMaterial>;
  dateMarkerLabelStyle?: CSSProperties;
  trackerIdStyle?: CSSProperties;

  trackHeight?: number;
  trackGap?: number;
  trackTopOffset?: number;

  colors: string[];
  zoneIds: Zone.AsObject[];

  selectedZone: number | null;

  onClickZone(zoneId: number): void;

  onScroll(timeFrame: { start?: Date; end?: Date }): void;
  style?: CSSProperties;
}

export * from './TimelineContainer';
