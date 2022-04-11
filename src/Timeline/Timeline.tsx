import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import {
  LineDashedMaterial,
  Color,
  Mesh,
  MeshBasicMaterial,
  Group,
  BufferGeometry,
} from 'three';
import TimeMarkers from './TimeMarkers';
import { Zone } from 'proto-all-js/deployment/organization_pb';
import TimelineTracks from './TimelineTracks';
import add from 'date-fns/add';
import React from 'react';
import ScrollControls from './utils/ScrollControls';
import useCameraUpdate from './utils/useCameraUpdate';
import { TimelineProps } from '..';
import {
  TIMELINE_LABELS_ID,
  TOOLTIP_ID,
  TIMELINE_ID,
  NON_HIGHLIGHTED_COLOR,
} from './constants';
import DragControls from './utils/DragControls';

interface TooltipData {
  duration: number;
  point: { x: number; y: number };
  zone: Zone.AsObject;
}

interface MarkerBreakpoint {
  minScale: number;
  interval: Duration;
  timeFormat: string;
}

const MARKER_BREAKPOINTS: MarkerBreakpoint[] = [
  { minScale: 1080, interval: { days: 1 }, timeFormat: 'HH:mm' },
  { minScale: 720, interval: { hours: 18 }, timeFormat: 'HH:mm' },
  { minScale: 360, interval: { hours: 12 }, timeFormat: 'HH:mm' },
  { minScale: 280, interval: { hours: 8 }, timeFormat: 'HH:mm' },
  { minScale: 230, interval: { hours: 6 }, timeFormat: 'HH:mm' },
  { minScale: 150, interval: { hours: 4 }, timeFormat: 'HH:mm' },
  { minScale: 120, interval: { hours: 2 }, timeFormat: 'HH:mm' },
  { minScale: 86, interval: { hours: 1, minutes: 30 }, timeFormat: 'HH:mm' },
  { minScale: 60, interval: { hours: 1 }, timeFormat: 'HH:mm' },
  { minScale: 38, interval: { minutes: 45 }, timeFormat: 'HH:mm' },
  { minScale: 25, interval: { minutes: 30 }, timeFormat: 'HH:mm' },
  { minScale: 18, interval: { minutes: 20 }, timeFormat: 'HH:mm' },
  { minScale: 13, interval: { minutes: 15 }, timeFormat: 'HH:mm' },
  { minScale: 7, interval: { minutes: 10 }, timeFormat: 'HH:mm' },
  { minScale: 3.4, interval: { minutes: 5 }, timeFormat: 'HH:mm' },
  { minScale: 3, interval: { minutes: 4 }, timeFormat: 'HH:mm' },
  { minScale: 1.5, interval: { minutes: 2 }, timeFormat: 'HH:mm' },
  {
    minScale: 0.4,
    interval: { minutes: 1, seconds: 30 },
    timeFormat: 'HH:mm:ss',
  },
  { minScale: 0.5, interval: { seconds: 50 }, timeFormat: 'HH:mm:ss' },
  { minScale: 0.2, interval: { seconds: 20 }, timeFormat: 'HH:mm:ss' },
  { minScale: 0, interval: { seconds: 10 }, timeFormat: 'HH:mm:ss' },
];

const defaultTimeMarkerLabelStyle: CSSProperties = {
  position: 'absolute',
  color: '#cbd5e0',
  top: '45px',
  fontFamily: 'Helvetica',
  fontWeight: '700',
  fontSize: '0.75rem',
};
const defaultTimeMarkerStyle: Partial<LineDashedMaterial> = {
  color: new Color('#a0aec0'),
  linewidth: 1,
  dashSize: 3,
  gapSize: 3,
};
const defaultDateMarkerStyle: Partial<LineDashedMaterial> = {
  color: new Color('#a0aec0'),
  linewidth: 3,
  dashSize: 3,
  gapSize: 3,
};
const defaultDateLabelStyle: CSSProperties = {
  position: 'absolute',
  color: '#a0aec0',
  fontFamily: 'Helvetica',
  fontSize: '0.75rem',
  top: '20px',
};

const Timeline = ({
  timeFrame,
  timelineData,

  zoomSensitivity = 0.25,

  timeMarkerStyle,
  timeMarkerLabelStyle,
  dateMarkerStyle,
  dateMarkerLabelStyle,
  trackHeight = 25,
  trackGap = 10,
  trackTopOffset = 20,
  colors,
  zoneIds,

  selectedZone,

  onClickZone,
}: Omit<TimelineProps, 'labels' | 'ref'>) => {
  const { gl, invalidate } = useThree(({ gl, invalidate }) => ({
    gl,
    invalidate,
  }));
  const camera = useCameraUpdate();

  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const groupRef = useRef<Group>();

  useFrame(() => {
    const labels = document.getElementById(TIMELINE_LABELS_ID);
    if (!labels) {
      return;
    }

    labels.style.top = `${camera.position.y + trackTopOffset}px`;
  });

  useEffect(() => {
    const cameraPosition =
      (timeFrame.start.getTime() + timeFrame.end.getTime()) / 2 / 1000;
    const cameraScale =
      (timeFrame.end.getTime() - timeFrame.start.getTime()) /
      1000 /
      gl.domElement.clientWidth;

    camera.position.setX(cameraPosition);
    camera.scale.setX(cameraScale);
    camera.updateProjectionMatrix();

    invalidate();
  }, [camera, gl.domElement.clientWidth, invalidate, timeFrame]);

  const markers = useMemo(() => {
    const currentScaled =
      camera.position.x - (gl.domElement.clientWidth * camera.scale.x) / 2;
    const endScaled =
      camera.position.x + (gl.domElement.clientWidth * camera.scale.x) / 2;

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
        timeMarkerLabelStyle={{
          ...defaultTimeMarkerLabelStyle,
          ...timeMarkerLabelStyle,
        }}
        timeMarkerStyle={{
          ...defaultTimeMarkerStyle,
          ...timeMarkerStyle,
        }}
      />
    );
  }, [
    camera.position.x,
    camera.scale.x,
    gl.domElement.clientWidth,
    timeMarkerLabelStyle,
    timeMarkerStyle,
  ]);

  const dateMarkers = useMemo(() => {
    const currentScaled =
      camera.position.x - (gl.domElement.clientWidth * camera.scale.x) / 2;
    const endScaled =
      camera.position.x + (gl.domElement.clientWidth * camera.scale.x) / 2;

    let currentCameraTime = Number(currentScaled.toFixed(1));
    let endCameraTime = Number(endScaled.toFixed(1));

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
        timeMarkerLabelStyle={{
          ...defaultDateLabelStyle,
          ...dateMarkerLabelStyle,
        }}
        timeMarkerStyle={{ ...defaultDateMarkerStyle, ...dateMarkerStyle }}
        isDate
      />
    );
  }, [
    camera.position.x,
    camera.scale.x,
    dateMarkerLabelStyle,
    dateMarkerStyle,
    gl.domElement.clientWidth,
  ]);

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
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timelineData, timeFrame, selectedZone]
  );

  const handleEnter = (e: ThreeEvent<PointerEvent>) => {
    const hoveredMesh = e.intersections[0].object as Mesh<
      BufferGeometry,
      MeshBasicMaterial
    >;
    if (tooltip && hoveredMesh.userData.zone === tooltip.zone) {
      setTooltip({
        ...tooltip,
        point: {
          x: e.nativeEvent.clientX,
          y: e.nativeEvent.clientY,
        },
      });

      return;
    }

    const hoveredGroup = e.intersections[0].eventObject;
    hoveredGroup.children.forEach((mesh) => {
      const color = new Color(NON_HIGHLIGHTED_COLOR);
      color.convertSRGBToLinear();

      (mesh as Mesh<BufferGeometry, MeshBasicMaterial>).material.color = color;
    });

    const foundGeometry = hoveredMesh.geometry.userData.mergedUserData.find(
      ({ start, end }: any) => {
        const x = e.point.x - hoveredMesh.position.x;

        if (x >= start && x <= end) {
          return true;
        }

        return false;
      }
    );

    if (!foundGeometry) {
      return;
    }

    setTooltip({
      duration: foundGeometry.duration,
      point: {
        x: e.nativeEvent.clientX,
        y: e.nativeEvent.clientY,
      },
      zone: hoveredMesh.userData.zone,
    });

    const hoveredColor = new Color(colors[hoveredMesh.userData.zone.id - 1]);
    hoveredColor.convertSRGBToLinear();

    hoveredMesh.material.color = hoveredColor;
  };

  const handleLeave = () => {
    if (!groupRef.current) {
      return;
    }
    groupRef.current.children.forEach((mesh) => {
      if (mesh.userData.zone === undefined) {
        return;
      }

      let color = new Color(colors[mesh.userData.zone.id - 1]);
      if (selectedZone !== null && selectedZone !== mesh.userData.zone.id) {
        color = new Color(NON_HIGHLIGHTED_COLOR);
      }
      color.convertSRGBToLinear();

      ((mesh as Mesh).material as MeshBasicMaterial).color = color;
    });

    setTooltip(null);
  };

  useEffect(() => {
    const el = document.getElementById(TOOLTIP_ID);
    if (!el) {
      return;
    }

    if (!tooltip) {
      el.style.display = 'none';
      return;
    }

    const ele = document.getElementById(TIMELINE_ID);
    if (!ele) {
      return;
    }

    el.style.display = 'block';
    el.style.left = `${tooltip.point.x}px`;
    el.style.top = `${
      tooltip.point.y - 65 + document.documentElement.scrollTop
    }px`;
    el.style.borderColor = colors[tooltip.zone.id - 1];
    el.style.color = colors[tooltip.zone.id - 1];
    el.innerHTML = `
    <div>${tooltip.zone.config?.name ?? `Zona ${tooltip.zone.id}`}</div>
    <div style="color: black !important">${formatDuration(
      tooltip.duration
    )}</div>`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tooltip]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    const hoveredMesh = e.intersections[0].object as Mesh<
      BufferGeometry,
      MeshBasicMaterial
    >;

    onClickZone(hoveredMesh.userData.zone.id);
  };

  return (
    <>
      <group>
        <group>{markers}</group>

        <group>{dateMarkers}</group>
        <group
          onClick={handleClick}
          onPointerMove={handleEnter}
          onPointerLeave={handleLeave}
          ref={groupRef}
        >
          {tracks}
        </group>
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

export default Timeline;

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
