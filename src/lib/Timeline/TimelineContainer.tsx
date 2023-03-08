import { forwardRef, Fragment } from "react";
import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";
import { Timeline } from "./Timeline";
import React from "react";
import {
  TIMELINE_LABELS_ID,
  TIMELINE_PARENT_ID,
  TOOLTIP_ID,
  TRACK_GAP,
  TRACK_HEIGHT,
  TRACK_TOP_OFFSET,
  ZOOM_SENSITIVITY,
} from "./constants";
import { TimelineProps } from "./types";

export const TimelineContainer = forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      timeFrame,
      timelineData,
      labels,
      zoomSensitivity = ZOOM_SENSITIVITY,
      trackHeight = TRACK_HEIGHT,
      trackGap = TRACK_GAP,
      trackTopOffset = TRACK_TOP_OFFSET,
      colors,
      selectedZone,
      onClickZone,
      zoneIds,
      onScroll,
      style,
      leftMarginInRem = 0,
      ...props
    }: TimelineProps,
    ref
  ) => {
    const timeFrameCenter = new Vector3(
      (timeFrame.start.getTime() + timeFrame.end.getTime()) / 2 / 1000,
      0,
      3
    );

    return zoneIds.length !== 0 &&
      Object.keys(timelineData).length !== 0 &&
      colors.length !== 0 ? (
      <div style={{ position: "relative", height: "100%" }}>
        <div
          id={TIMELINE_PARENT_ID}
          ref={ref}
          style={{
            position: "relative",
            backgroundColor: "#f7fafc",
            overflow: "hidden",
            height: "calc(100% - 6rem)",
            paddingBottom: "6rem",
            userSelect: "none",
            ...style,
          }}
        >
          <div
            style={{
              position: "relative",
              height: "100%",
              overflow: "hidden",
              top: "4.2rem",
            }}
          >
            <Canvas
              style={{
                height: "100%",
                width: `calc(100% - ${6 + leftMarginInRem / 1.5}rem)`,
                left: `${4 + leftMarginInRem}rem`,
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#f7fafc",
              }}
              camera={{
                position: timeFrameCenter,
                lookAt: (_x) => {
                  _x = timeFrameCenter.x;
                },
              }}
              gl={{
                preserveDrawingBuffer: true,
                powerPreference: "high-performance",
                antialias: false,
              }}
              orthographic
              frameloop="demand"
            >
              <Timeline
                zoomSensitivity={zoomSensitivity}
                trackHeight={trackHeight}
                trackGap={trackGap}
                trackTopOffset={trackTopOffset}
                colors={colors}
                timelineData={timelineData}
                timeFrame={timeFrame}
                selectedZone={selectedZone}
                onClickZone={onClickZone}
                zoneIds={zoneIds}
                onScroll={onScroll}
                leftMarginInRem={leftMarginInRem}
                {...props}
              />
            </Canvas>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                position: "absolute",
                left: "0.5rem",
                gap: `${trackGap}px`,
              }}
              id={TIMELINE_LABELS_ID}
            >
              {Object.entries(labels)
                .sort(
                  ([firstId], [secondId]) => Number(firstId) - Number(secondId)
                )
                .map(([trackerId, children]) => (
                  <Fragment key={`timeline-subject-${trackerId}`}>
                    <div style={{ height: `${trackHeight}px` }}>{children}</div>
                  </Fragment>
                ))}
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            display: "none",
            flexDirection: "column",
            backgroundColor: "white",
            border: "2px solid black",
            borderRadius: "0.15rem",
            padding: "0.5rem",
            pointerEvents: "none",
          }}
          id={TOOLTIP_ID}
        />
      </div>
    ) : (
      <></>
    );
  }
);
