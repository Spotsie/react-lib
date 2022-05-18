import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import React from 'react';
import { Vector3 } from 'three';

interface Props {
  zoomSensitivity: number;

  maxScroll: number;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 1200;

const ScrollControls = ({ zoomSensitivity, maxScroll }: Props) => {
  const { camera, gl, invalidate } = useThree(({ camera, gl, invalidate }) => ({
    camera,
    gl,
    invalidate,
  }));
  const canvas = gl.domElement;

  const previousTouch = useRef<Touch | null>(null);
  const previousDist = useRef<number | null>(null);

  useEffect(() => {
    if (
      camera.position.y > 0 ||
      camera.position.y < -maxScroll + canvas.clientHeight
    ) {
      camera.position.setY(0);
    }

    const zoomEvent = (e: WheelEvent) => {
      e.preventDefault();

      if (!e.ctrlKey) {
        if (maxScroll <= canvas.clientHeight) {
          return;
        }

        const amount = e.deltaY;

        if (camera.position.y - amount > 0) {
          camera.position.setY(0);
        } else if (
          camera.position.y - amount <
          -maxScroll + canvas.clientHeight
        ) {
          camera.position.setY(-maxScroll + canvas.clientHeight);
        } else {
          camera.translateY(-amount);
        }
      } else {
        // Don't calculate new scale before the last update is done
        if (camera.matrixWorldNeedsUpdate) {
          return;
        }

        const newScale = Number(
          (
            camera.scale.x +
            (zoomSensitivity * camera.scale.x) / Math.sign(e.deltaY)
          ).toFixed(2)
        );

        // Get the current local & world mouse coords
        // 80 is padding
        const currDistanceMouseFromCenter =
          e.clientX - gl.domElement.clientWidth / 2 - 80;
        const currObjectPosition = camera.localToWorld(
          new Vector3(currDistanceMouseFromCenter)
        );

        camera.scale.setX(Math.min(Math.max(MIN_SCALE, newScale), MAX_SCALE));

        // Update the world matrix before calculating new positions
        camera.updateMatrixWorld();

        // Get new world mouse coords and offset with the previous mouse coords
        const newObjectPos = camera.localToWorld(
          new Vector3(currDistanceMouseFromCenter)
        );
        const newDistanceFromMouseToCenter = newObjectPos.x - camera.position.x;
        const newCameraPosition =
          currObjectPosition.x - newDistanceFromMouseToCenter;

        camera.position.setX(newCameraPosition);
      }

      camera.updateProjectionMatrix();
      camera.updateMatrix();
      invalidate();
    };
    canvas.addEventListener('wheel', zoomEvent);

    const dragUpEvent = () => {
      previousTouch.current = null;
      previousDist.current = null;
    };
    const dragEvent = (e: TouchEvent) => {
      e.preventDefault();

      if (e.touches.length === 2) {
        const distance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        if (!previousDist.current) {
          previousDist.current = distance;
        }
        const newScale = Number(
          (
            camera.scale.x +
            0.01 * (camera.scale.x * (previousDist.current - distance))
          ).toFixed(2)
        );

        camera.scale.setX(Math.min(Math.max(MIN_SCALE, newScale), MAX_SCALE));
        previousDist.current = distance;

        return;
      }

      const touch = e.touches[0];

      if (!previousTouch.current) {
        previousTouch.current = touch;
      }

      const movementY = touch.pageY - previousTouch.current.pageY;

      if (camera.position.y + movementY > 0) {
        camera.position.setY(0);
      } else if (
        camera.position.y + movementY <
        -maxScroll + canvas.clientHeight
      ) {
        camera.position.setY(-maxScroll + canvas.clientHeight);
      } else {
        camera.translateY(movementY);
      }

      camera.updateProjectionMatrix();

      invalidate();

      previousTouch.current = touch;
    };
    canvas.addEventListener('touchend', dragUpEvent);
    canvas.addEventListener('touchmove', dragEvent);

    return () => {
      canvas.removeEventListener('wheel', zoomEvent);
      canvas.removeEventListener('touchend', dragUpEvent);
      canvas.removeEventListener('touchmove', dragEvent);
    };
  }, [camera, canvas, zoomSensitivity, invalidate, maxScroll]);

  return <></>;
};

export default ScrollControls;
