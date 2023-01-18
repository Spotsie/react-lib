import { CSSProperties } from "react";
import { LineDashedMaterial, Color } from "three";
import { MarkerBreakpoint } from "./types";

export const TIMELINE_PARENT_ID = "timeline-parent";
export const TOOLTIP_ID = "timeline-tooltip";
export const TIMELINE_LABELS_ID = "timeline-labels";

export const NON_HIGHLIGHTED_COLOR = "#555555";

export const HOVER_ANIMATION_DELAY = 150;

export const TIME_MARKER_LABEL_STYLE: CSSProperties = {
  position: "absolute",
  color: "#cbd5e0",
  top: "45px",
  fontFamily: "Helvetica",
  fontWeight: "700",
  fontSize: "0.75rem",
};
export const TIME_MARKER_STYLE: Partial<LineDashedMaterial> = {
  color: new Color("#a0aec0"),
  linewidth: 1,
  dashSize: 3,
  gapSize: 3,
};

export const DATE_MARKER_LABEL_STYLE: CSSProperties = {
  position: "absolute",
  color: "#a0aec0",
  fontFamily: "Helvetica",
  fontSize: "0.75rem",
  top: "20px",
};

export const DATE_MARKER_STYLE: Partial<LineDashedMaterial> = {
  color: new Color("#a0aec0"),
  linewidth: 3,
  dashSize: 3,
  gapSize: 3,
};

export const MARKER_BREAKPOINTS: MarkerBreakpoint[] = [
  { minScale: 1080, interval: { days: 1 }, timeFormat: "HH:mm" },
  { minScale: 720, interval: { hours: 18 }, timeFormat: "HH:mm" },
  { minScale: 360, interval: { hours: 12 }, timeFormat: "HH:mm" },
  { minScale: 280, interval: { hours: 8 }, timeFormat: "HH:mm" },
  { minScale: 230, interval: { hours: 6 }, timeFormat: "HH:mm" },
  { minScale: 150, interval: { hours: 4 }, timeFormat: "HH:mm" },
  { minScale: 120, interval: { hours: 2 }, timeFormat: "HH:mm" },
  { minScale: 86, interval: { hours: 1, minutes: 30 }, timeFormat: "HH:mm" },
  { minScale: 60, interval: { hours: 1 }, timeFormat: "HH:mm" },
  { minScale: 38, interval: { minutes: 45 }, timeFormat: "HH:mm" },
  { minScale: 25, interval: { minutes: 30 }, timeFormat: "HH:mm" },
  { minScale: 18, interval: { minutes: 20 }, timeFormat: "HH:mm" },
  { minScale: 13, interval: { minutes: 15 }, timeFormat: "HH:mm" },
  { minScale: 7, interval: { minutes: 10 }, timeFormat: "HH:mm" },
  { minScale: 3.4, interval: { minutes: 5 }, timeFormat: "HH:mm" },
  { minScale: 3, interval: { minutes: 4 }, timeFormat: "HH:mm" },
  { minScale: 1.5, interval: { minutes: 2 }, timeFormat: "HH:mm" },
  {
    minScale: 0.4,
    interval: { minutes: 1, seconds: 30 },
    timeFormat: "HH:mm:ss",
  },
  { minScale: 0.5, interval: { seconds: 50 }, timeFormat: "HH:mm:ss" },
  { minScale: 0.2, interval: { seconds: 20 }, timeFormat: "HH:mm:ss" },
  { minScale: 0, interval: { seconds: 10 }, timeFormat: "HH:mm:ss" },
];

export const MAX_SCALE = 1200;

export const TRACK_HEIGHT = 15;
export const TRACK_GAP = 10;
export const TRACK_TOP_OFFSET = 20;

export const ZOOM_SENSITIVITY = 0.25;
