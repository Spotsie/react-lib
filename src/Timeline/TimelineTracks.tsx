import { useThree } from '@react-three/fiber';
import { Zone } from 'proto-all-js/deployment/organization_pb';
import { LocationHistoryRecord } from 'proto-all-js/location/location_pb';
import React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { BufferGeometry, Color, Mesh, MeshBasicMaterial, Vector2 } from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { NON_HIGHLIGHTED_COLOR } from './constants';

interface TrackProps {
  locationRecords: { [id: number]: LocationHistoryRecord.AsObject[] };

  trackHeight: number;
  trackGap: number;
  topOffset: number;

  colors: string[];
  zoneIds: Zone.AsObject[];

  selectedZone: number | null;
}

const TimelineTracks = ({
  locationRecords,
  trackHeight,
  trackGap,
  topOffset,
  colors,
  zoneIds,
  selectedZone,
}: TrackProps) => {
  const meshRefs = useRef<Mesh[]>([]);

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
    if (!meshRefs.current || Object.keys(locationRecords).length === 0) {
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
          duration: trackRight - trackLeft,
          start: trackLeft,
          end: trackRight,
        };

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

    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasHeight, gl.domElement.clientHeight, locationRecords]);

  useEffect(() => {
    meshRefs.current.forEach((mesh) => {
      mesh.position.setX(initialTrackXPos);
      mesh.updateMatrix();
    });
  }, [initialTrackXPos]);

  useEffect(() => {
    meshRefs.current.forEach((mesh) => {
      let color = new Color(colors[mesh.userData.zone.id - 1]);
      if (selectedZone !== null && selectedZone !== mesh.userData.zone) {
        color = new Color(NON_HIGHLIGHTED_COLOR);
      }
      color.convertSRGBToLinear();

      (mesh as Mesh<BufferGeometry, MeshBasicMaterial>).material.color = color;
    });
  }, [selectedZone]);

  const render = useMemo(
    () =>
      zoneIds.map(({ id: zoneId }, index) => {
        let color = new Color(colors[zoneId - 1]);
        color.convertSRGBToLinear();

        return (
          <mesh
            key={`mesh-${index}-zone-${zoneId}`}
            ref={(el) => {
              if (!el) {
                return;
              }

              meshRefs.current[zoneId] = el;
            }}
            material={new MeshBasicMaterial({ color, toneMapped: false })}
            position={[initialTrackXPos, 0, 0]}
          />
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colors, zoneIds]
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
