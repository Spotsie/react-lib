import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, CSSProperties, useMemo } from "react";
import {
  BufferGeometry,
  LineDashedMaterial,
  LineSegments,
  Mesh,
  Vector3,
} from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import React from "react";
import useCameraUpdate from "./utils/useCameraUpdate";
import { TIMELINE_PARENT_ID } from "./constants";

interface Props {
  period: { start: number; end: number };
  interval: number;
  showSeconds?: boolean;

  hideMarker?: boolean;

  timeMarkerStyle: Partial<LineDashedMaterial>;
  timeMarkerLabelStyle: CSSProperties;

  isDate?: boolean;

  leftMarginInRem: number;
  locale: "en" | "hr";
}

const TIME_MARKER_VERTICAL_POINTS = (xPos: number) => [
  new Vector3(xPos, -20000, -3),
  new Vector3(xPos, 20000, -3),
];

const TimeMarkers = ({
  period,
  interval,
  showSeconds = false,
  hideMarker,
  timeMarkerStyle,
  timeMarkerLabelStyle,
  isDate,
  leftMarginInRem,
  locale,
}: Props) => {
  const meshRef = useRef<Mesh>(null);
  const lineRef = useRef<LineSegments>(null);

  const currDateMarkerRef = useRef<HTMLDivElement>();
  const flexRef = useRef<HTMLDivElement>();

  const gl = useThree(({ gl }) => gl);
  const camera = useCameraUpdate();

  const xPositions = useMemo(() => {
    const positions: number[] = [];
    let { start, end } = period;
    // Amount of times the markers will appear out of bounds to look
    // Better when scrolling
    const offsetAmount = 1;
    start = start - interval * offsetAmount;
    end = end + interval * offsetAmount;

    while (start <= end) {
      positions.push(start);

      start += interval;
    }

    return positions;
  }, [period, interval]);

  useFrame(() => {
    if (!flexRef.current) {
      return;
    }

    const childWidth =
      flexRef.current.children[0]?.getBoundingClientRect().width ?? 0;

    const cameraStartPosition =
      camera.position.x - (gl.domElement.clientWidth * camera.scale.x) / 2;

    flexRef.current.style.left = `calc(${
      camera.worldToLocal(new Vector3(xPositions[0])).x -
      camera.worldToLocal(new Vector3(cameraStartPosition)).x -
      childWidth / 2
    }px + ${4 + leftMarginInRem}rem)`;
  });

  useEffect(() => {
    if (!lineRef.current || xPositions.length === 0) {
      return;
    }

    const flexElement = document.createElement("div");
    assignStyling(flexElement, {
      ...timeMarkerLabelStyle,
      display: "flex",
      justifyContent: "space-between",
    });
    document.getElementById(TIMELINE_PARENT_ID)?.appendChild(flexElement);
    flexRef.current = flexElement;

    const currDateMarker = document.createElement("div");
    if (isDate) {
      const time =
        camera.position.x - (gl.domElement.clientWidth * camera.scale.x) / 2;
      currDateMarker.innerHTML = Intl.DateTimeFormat(["bin", locale]).format(
        new Date(time * 1000)
      );

      assignStyling(currDateMarker, {
        ...timeMarkerLabelStyle,
        top: "25px",
      });

      document.getElementById(TIMELINE_PARENT_ID)?.appendChild(currDateMarker);
      currDateMarkerRef.current = currDateMarker;

      currDateMarker.style.left = `calc(${4 + leftMarginInRem}rem - ${
        currDateMarker.getBoundingClientRect().width / 2
      }px)`;
    }

    const geoms = xPositions.map((xPos) => {
      const text = document.createElement("div");
      text.innerHTML = Intl.DateTimeFormat(["bin", locale], {
        timeStyle: showSeconds ? "medium" : "short",
      }).format(new Date(xPos * 1000));
      text.style.whiteSpace = "nowrap";
      flexElement.appendChild(text);

      const geom = new BufferGeometry();
      geom.setFromPoints(TIME_MARKER_VERTICAL_POINTS(xPos - period.start));

      return geom;
    });

    flexElement.style.width = `${
      ((xPositions.length - 1) * interval) / camera.scale.x +
        flexElement.children[0]?.getBoundingClientRect().width ?? 0
    }px`;

    const geo = BufferGeometryUtils.mergeBufferGeometries(geoms);

    lineRef.current.geometry = geo;
    lineRef.current.computeLineDistances();
    lineRef.current.updateMatrix();

    return () => {
      flexElement.remove();
      currDateMarker.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gl.domElement.clientHeight,
    gl.domElement.clientWidth,
    period.start,
    showSeconds,
    timeMarkerLabelStyle,
    xPositions,
  ]);

  return hideMarker ? (
    <></>
  ) : (
    <mesh visible position={[period.start, 0, 2]} ref={meshRef}>
      <lineSegments ref={lineRef}>
        <lineDashedMaterial
          attach="material"
          color="#a0aec0"
          linewidth={2}
          dashSize={3}
          gapSize={3}
          {...timeMarkerStyle}
        />
      </lineSegments>
    </mesh>
  );
};

export default TimeMarkers;

const assignStyling = (element: HTMLElement, style: CSSProperties) =>
  Object.entries(style).forEach(
    ([key, value]) => (element.style[key as any] = value)
  );
