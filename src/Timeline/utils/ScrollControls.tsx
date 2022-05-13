import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import React from 'react';

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
        const newScale = Number(
          (
            camera.scale.x +
            (zoomSensitivity * camera.scale.x) / Math.sign(e.deltaY)
          ).toFixed(2)
        );

        camera.scale.setX(Math.min(Math.max(MIN_SCALE, newScale), MAX_SCALE));
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
        const dist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        if (!previousDist.current) {
          previousDist.current = dist;
        }
        const newScale = Number(
          (
            camera.scale.x +
            0.01 * (camera.scale.x * (previousDist.current - dist))
          ).toFixed(2)
        );

        camera.scale.setX(Math.min(Math.max(MIN_SCALE, newScale), MAX_SCALE));
        previousDist.current = dist;

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
