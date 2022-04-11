import { useEffect } from 'react';
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

    return () => {
      canvas.removeEventListener('wheel', zoomEvent);
    };
  }, [camera, canvas, zoomSensitivity, invalidate, maxScroll]);

  return <></>;
};

export default ScrollControls;
