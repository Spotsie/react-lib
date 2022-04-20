import { forwardRef, Fragment } from 'react';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import Timeline from './Timeline';
import React from 'react';
import { TimelineProps } from '..';
import {
  TIMELINE_ID,
  TIMELINE_LABELS_ID,
  TIMELINE_PARENT_ID,
  TOOLTIP_ID,
} from './constants';

export const TimelineContainer = forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      timeFrame,
      timelineData,
      labels,
      zoomSensitivity,
      trackHeight = 15,
      trackGap = 10,
      trackTopOffset = 20,
      colors,
      selectedZone,
      onClickZone,
      zoneIds,
      ...props
    }: TimelineProps,
    ref
  ) => {
    const timeFrameCenter =
      (timeFrame.start.getTime() + timeFrame.end.getTime()) / 2 / 1000;

    return zoneIds.length !== 0 &&
      Object.keys(timelineData).length !== 0 &&
      colors.length !== 0 ? (
      <>
        <div
          id={TIMELINE_PARENT_ID}
          ref={ref}
          style={{
            position: 'relative',
            backgroundColor: '#f7fafc',
            overflow: 'hidden',
            height: '40rem',
            paddingBottom: '6rem',
          }}
        >
          <div
            style={{
              position: 'relative',
              height: '100%',
              overflow: 'hidden',
              top: '4.2rem',
            }}
          >
            <div
              style={{
                paddingLeft: '4rem',
                paddingRight: '2rem',
                overflow: 'hidden',
                position: 'relative',
                height: 'calc(40rem - 6rem)',
                backgroundColor: '#f7fafc',
              }}
              id={TIMELINE_ID}
            >
              <Canvas
                camera={{
                  position: new Vector3(timeFrameCenter, 0, 3),
                  ///@ts-ignore
                  lookAt: (x) => {
                    x = timeFrameCenter;
                  },
                }}
                gl={{
                  preserveDrawingBuffer: true,
                  powerPreference: 'high-performance',
                }}
                orthographic
                frameloop="demand"
                onCreated={(state) => {
                  if (state.gl.domElement.parentElement) {
                    state.gl.domElement.parentElement.style.height = '100%';
                  }
                }}
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
                  {...props}
                />
              </Canvas>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                left: '0.5rem',
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
            position: 'absolute',
            display: 'none',
            flexDirection: 'column',
            backgroundColor: 'white',
            border: '2px solid black',
            borderRadius: '0.15rem',
            padding: '0.5rem',
            pointerEvents: 'none',
          }}
          id={TOOLTIP_ID}
        />
      </>
    ) : (
      <></>
    );
  }
);
