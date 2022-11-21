import { ThreeEvent, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Mesh, MeshBasicMaterial, BufferGeometry } from 'three';
import TimeMarkers from './TimeMarkers';
import TimelineTracks from './TimelineTracks';
import add from 'date-fns/add';
import React from 'react';
import ScrollControls from './utils/ScrollControls';
import useCameraUpdate from './utils/useCameraUpdate';
import {
  TOOLTIP_ID,
  TIMELINE_LABELS_ID,
  HOVER_ANIMATION_DELAY,
  TIME_MARKER_LABEL_STYLE,
  TIME_MARKER_STYLE,
  DATE_MARKER_LABEL_STYLE,
  DATE_MARKER_STYLE,
  MARKER_BREAKPOINTS,
  MAX_SCALE,
} from './constants';
import DragControls from './utils/DragControls';
import { TimelineCanvasProps, TooltipData } from './types';

export const Timeline = ({
  timeFrame,
  timelineData,

  zoomSensitivity,

  trackHeight,
  trackGap,
  trackTopOffset,

  colors,
  zoneIds,

  selectedZone,

  onClickZone,
  onScroll,
}: TimelineCanvasProps) => {
  const { gl, invalidate } = useThree(({ gl, invalidate }) => ({
    gl,
    invalidate,
  }));
  const camera = useCameraUpdate();

  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const meshRef = useRef<Mesh>(null);

  const timeout = useRef<NodeJS.Timeout>();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const cameraPosition =
      (timeFrame.start.getTime() + timeFrame.end.getTime()) / 2 / 1000;
    const cameraScale =
      (timeFrame.end.getTime() - timeFrame.start.getTime()) /
      1000 /
      gl.domElement.clientWidth;

    camera.position.setX(cameraPosition);
    camera.scale.setX(Math.min(cameraScale, MAX_SCALE));
    camera.updateProjectionMatrix();

    invalidate();
  }, []);

  useEffect(() => {
    const labels = document.getElementById(TIMELINE_LABELS_ID);
    if (!labels) {
      return;
    }

    labels.style.top = `${camera.position.y + trackTopOffset}px`;
  }, [camera.position.y, trackTopOffset]);

  const timeMarkers = useMemo(() => {
    const currentScaled =
      camera.position.x - (gl.domElement.clientWidth * camera.scale.x) / 2;
    const endScaled =
      camera.position.x + (gl.domElement.clientWidth * camera.scale.x) / 2;

    if (isNaN(currentScaled) || isNaN(endScaled)) {
      return <></>;
    }

    let currentCameraTime = Number(currentScaled.toFixed(1));
    let endCameraTime = Number(endScaled.toFixed(1));

    const breakpoint =
      MARKER_BREAKPOINTS.find(
        (breakpoint) => camera.scale.x > breakpoint.minScale
      ) ?? MARKER_BREAKPOINTS[MARKER_BREAKPOINTS.length - 1];

    const interval = durationToSeconds(breakpoint.interval);

    currentCameraTime = Math.ceil(currentCameraTime / interval) * interval;

    return (
      <TimeMarkers
        period={{ start: currentCameraTime, end: endCameraTime }}
        interval={interval}
        timeFormat={breakpoint.timeFormat}
        timeMarkerLabelStyle={TIME_MARKER_LABEL_STYLE}
        timeMarkerStyle={TIME_MARKER_STYLE}
      />
    );
  }, [camera.position.x, camera.scale.x, gl.domElement.clientWidth]);

  const dateMarkers = useMemo(() => {
    const currentScaled =
      camera.position.x - (gl.domElement.clientWidth * camera.scale.x) / 2;
    const endScaled =
      camera.position.x + (gl.domElement.clientWidth * camera.scale.x) / 2;

    if (isNaN(currentScaled) || isNaN(endScaled)) {
      return <></>;
    }

    let currentCameraTime = Number(currentScaled.toFixed(1));
    const endCameraTime = Number(endScaled.toFixed(1));

    const interval = durationToSeconds({ days: 1 });
    const dateFormat = 'dd.MM.yyyy.';

    currentCameraTime =
      Math.ceil(currentCameraTime / interval) * interval +
      new Date().getTimezoneOffset() * 60;

    return (
      <TimeMarkers
        period={{ start: currentCameraTime, end: endCameraTime }}
        interval={interval}
        timeFormat={dateFormat}
        timeMarkerLabelStyle={DATE_MARKER_LABEL_STYLE}
        timeMarkerStyle={DATE_MARKER_STYLE}
        isDate
      />
    );
  }, [camera.position.x, camera.scale.x, gl.domElement.clientWidth]);

  const tracks = useMemo(
    () => (
      <TimelineTracks
        locationRecords={timelineData}
        trackHeight={trackHeight}
        trackGap={trackGap}
        topOffset={trackTopOffset}
        colors={colors}
        zoneIds={zoneIds}
        selectedZone={selectedZone}
        onClickZone={onClickZone}
      />
    ),
    [timelineData, timeFrame, selectedZone]
  );

  const handleMoveTrack = (e: ThreeEvent<MouseEvent>) => {
    const tooltipX = e.nativeEvent.offsetX;
    const tooltipY = e.nativeEvent.offsetY;

    clearTimeout(timeout.current);

    const hoveredMesh = e.intersections[0].object as Mesh<
      BufferGeometry,
      MeshBasicMaterial
    >;
    // If tooltip is in the same zone, update only tooltip position
    if (tooltip && hoveredMesh.userData.zone === tooltip.zone) {
      setTooltip({
        ...tooltip,
        point: {
          x: tooltipX,
          y: tooltipY,
        },
      });

      return;
    }
    // If there is a selected zone, don't do anything else
    if (
      selectedZone !== null &&
      selectedZone !== hoveredMesh.userData.zone.id
    ) {
      return;
    }

    timeout.current = setTimeout(() => {
      const x = e.point.x - hoveredMesh.position.x;
      const y = e.point.y;

      const foundGeometry = hoveredMesh.geometry.userData.mergedUserData.find(
        ({ left, right, top, bottom }: any) =>
          x >= left && x <= right && y >= bottom && y <= top
      );

      if (!foundGeometry) {
        return;
      }

      const duration = foundGeometry.right - foundGeometry.left;

      setTooltip({
        duration,
        point: {
          x: tooltipX,
          y: tooltipY,
        },
        zone: hoveredMesh.userData.zone,
      });
    }, HOVER_ANIMATION_DELAY);
  };

  const handleLeaveTrack = () => {
    clearTimeout(timeout.current);

    setTooltip(null);
  };

  useEffect(() => {
    const tooltipContainer = document.getElementById(TOOLTIP_ID);
    if (!tooltipContainer) {
      return;
    }

    if (!tooltip) {
      tooltipContainer.style.display = 'none';
      return;
    }

    const zoneIndex = zoneIds
      .sort((first, second) => first.id - second.id)
      .findIndex((zoneId) => zoneId.id === tooltip.zone.id);
    const zoneColor = colors[zoneIndex];

    tooltipContainer.style.display = 'block';
    tooltipContainer.style.left = `calc(${tooltip.point.x}px + 4rem)`;
    tooltipContainer.style.top = `${tooltip.point.y}px`;
    tooltipContainer.style.borderColor = zoneColor;
    tooltipContainer.style.color = zoneColor;
    tooltipContainer.innerHTML = `
    <div>${tooltip.zone.config?.name ?? `Zona ${tooltip.zone.id}`}</div>
    <div style="color: black !important">${formatDuration(
      tooltip.duration
    )}</div>`;
  }, [tooltip]);

  useEffect(() => {
    if (!onScroll || !loaded) {
      setLoaded(true);
      return;
    }

    const cameraStart =
      camera.position.x - (gl.domElement.clientWidth * camera.scale.x) / 2;
    const cameraEnd =
      camera.position.x + (gl.domElement.clientWidth * camera.scale.x) / 2;

    const round = gl.domElement.clientWidth * camera.scale.x;

    const timeFrameStart = timeFrame.start.getTime() / 1000;
    const timeFrameEnd = timeFrame.end.getTime() / 1000;

    if (cameraStart - round / 1.5 <= timeFrameStart) {
      onScroll({
        start: new Date((cameraStart - round * 2) * 1000),
      });
    } else if (cameraEnd + round / 1.5 >= timeFrameEnd) {
      onScroll({
        end: new Date((cameraEnd + round * 2) * 1000),
      });
    }
  }, [camera.position.x]);

  return (
    <>
      <group>
        <group>{timeMarkers}</group>

        <group>{dateMarkers}</group>
        <mesh
          onPointerMove={handleMoveTrack}
          onPointerLeave={handleLeaveTrack}
          ref={meshRef}
        >
          {tracks}
        </mesh>
      </group>

      <DragControls dragSensitivity={1} />

      <ScrollControls
        zoomSensitivity={zoomSensitivity}
        maxScroll={
          Object.keys(timelineData).length * (trackHeight + trackGap) +
          trackTopOffset
        }
      />
    </>
  );
};

const durationToSeconds = (duration: Duration) =>
  add(0, duration).getTime() / 1000;

const formatDuration = (timeInSeconds: number) => {
  let hours = Math.floor(timeInSeconds / 3600);
  let minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
  let seconds = Math.round(timeInSeconds - hours * 3600 - minutes * 60);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
