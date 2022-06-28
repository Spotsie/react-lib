import { useThree } from '@react-three/fiber';
import { Zone } from 'proto-all-js/deployment/organization_pb';
import { LocationHistoryRecord } from 'proto-all-js/location/location_pb';
import React, { useState } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { BufferGeometry, Color, Mesh, Vector2 } from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { HOVER_ANIMATION_DELAY, NON_HIGHLIGHTED_COLOR } from './constants';
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from 'three-mesh-bvh';
import { motion } from 'framer-motion-3d';

interface Props {
  locationRecords: { [id: number]: LocationHistoryRecord.AsObject[] };

  trackHeight: number;
  trackGap: number;
  topOffset: number;

  colors: string[];
  zoneIds: Zone.AsObject[];

  selectedZone: number | null;

  onClickZone(zoneId: number | null): void;
}

const TimelineTracks = ({
  locationRecords,
  trackHeight,
  trackGap,
  topOffset,
  colors,
  zoneIds,
  selectedZone,
  onClickZone,
}: Props) => {
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);

  const meshRefs = useRef<Mesh[]>([]);

  // use BVH computations instead of 3js raytracing
  const useBVHs = () => {
    const geometries: BufferGeometry[] = [];

    meshRefs.current.forEach((mesh) => {
      if (!mesh.geometry.attributes.position) {
        return;
      }

      mesh.raycast = acceleratedRaycast;

      const geometry: any = mesh.geometry;
      geometries.push(mesh.geometry);

      geometry.computeBoundsTree = computeBoundsTree;
      geometry.disposeBoundsTree = disposeBoundsTree;
      geometry.computeBoundsTree();

      mesh.geometry = geometry;
    });

    return () => {
      geometries.forEach((geometry) => {
        if (geometry.boundsTree) {
          geometry.disposeBoundsTree();
        }
      });
    };
  };

  const { gl, invalidate } = useThree(({ gl, invalidate }) => ({
    gl,
    invalidate,
  }));

  const initialTrackXPos =
    Object.values(locationRecords)[0][0]?.fromTime?.seconds ?? 0;

  // The client height from the canvas is acting really weird
  // So I'm getting it from its parent
  const canvasHeight = gl.domElement.parentElement?.clientHeight ?? 0;

  useEffect(() => {
    if (Object.keys(locationRecords).length === 0) {
      return;
    }

    const geosByZoneId: { [zoneId: number]: BufferGeometry[] } = zoneIds.reduce(
      (acc, curr) => ({ ...acc, [curr.id]: [] }),
      {}
    );

    Object.entries(locationRecords).forEach(([_, locationRecords], index) => {
      const records = locationRecords as LocationHistoryRecord.AsObject[];

      records.forEach((record) => {
        const trackBottom =
          canvasHeight / 2 -
          trackHeight -
          topOffset -
          index * (trackHeight + trackGap);
        const trackTop = trackBottom + trackHeight;

        if (!record.fromTime || !record.toTime) {
          return;
        }

        const trackLeft = record.fromTime.seconds - initialTrackXPos;
        const trackRight = record.toTime.seconds - initialTrackXPos;

        const geo = getBufferGeometryFromPoints(
          trackLeft,
          trackRight,
          trackTop,
          trackBottom
        );

        geo.userData = {
          left: trackLeft,
          right: trackRight,
          top: trackTop,
          bottom: trackBottom,
        };

        if (!geosByZoneId[record.zone]) {
          geosByZoneId[record.zone] = [];
        }
        geosByZoneId[record.zone].push(geo);
      });
    });

    Object.entries(geosByZoneId).forEach(([zoneId, geos]) => {
      if (!meshRefs.current || geos.length === 0) {
        return;
      }

      const zone = +zoneId;

      const finalGeo = BufferGeometryUtils.mergeBufferGeometries(geos);
      meshRefs.current[zone].geometry = finalGeo;

      meshRefs.current[zone].userData = {
        zone: zoneIds.find(({ id }) => id === zone),
      };
      meshRefs.current[zone].updateMatrix();
    });

    useBVHs();
    invalidate();
  }, [canvasHeight, gl.domElement.clientHeight, locationRecords]);

  useEffect(() => {
    meshRefs.current.forEach((mesh) => {
      mesh.position.setX(initialTrackXPos);
      mesh.updateMatrix();
    });
  }, [initialTrackXPos]);

  const render = useMemo(
    () =>
      zoneIds
        .sort((first, second) => first.id - second.id)
        .map(({ id: zoneId }, index) => {
          let color = new Color(colors[index]);
          color.convertSRGBToLinear();

          return (
            <motion.mesh
              key={`mesh-${index}-zone-${zoneId}`}
              ref={(el) => {
                if (!el) {
                  return;
                }

                meshRefs.current[zoneId] = el as any;
              }}
              position={[initialTrackXPos, 0, 0]}
              onClick={() => onClickZone(zoneId)}
              onPointerEnter={() => setHoveredZone(zoneId)}
              onPointerLeave={() => setHoveredZone(null)}
              animate={
                selectedZone !== null
                  ? selectedZone !== zoneId
                    ? 'notSelected'
                    : 'selected'
                  : hoveredZone !== null
                  ? hoveredZone !== zoneId
                    ? 'notSelected'
                    : 'selected'
                  : 'selected'
              }
            >
              <motion.meshBasicMaterial
                onUpdate={() => invalidate()}
                toneMapped={false}
                transition={{
                  delay: HOVER_ANIMATION_DELAY / 1000,
                }}
                variants={{
                  selected: {
                    color: `#${color.getHexString()}`,
                  },
                  notSelected: {
                    color: NON_HIGHLIGHTED_COLOR,
                  },
                }}
              />
            </motion.mesh>
          );
        }),
    [colors, zoneIds, hoveredZone, selectedZone]
  );

  return <>{render}</>;
};

export default TimelineTracks;

const getBufferGeometryFromPoints = (
  left: number,
  right: number,
  top: number,
  bottom: number
) => {
  const geo = new BufferGeometry();

  geo.setFromPoints([
    new Vector2(left, bottom),
    new Vector2(right, bottom),
    new Vector2(right, top),

    new Vector2(right, top),
    new Vector2(left, top),
    new Vector2(left, bottom),
  ]);

  return geo;
};
