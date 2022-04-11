import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import React from 'react';

interface MousePosition {
  x: number;
  y: number;
}

interface Props {
  dragSensitivity: number;
}

type HTMLEvents = {
  [eventName in keyof HTMLElementEventMap]: (event: any) => void;
};

const DragControls = ({ dragSensitivity }: Props) => {
  const isDragging = useRef(false);
  const { gl, camera, invalidate } = useThree(({ camera, gl, invalidate }) => ({
    gl,
    camera,
    invalidate,
  }));
  const canvas = gl.domElement;

  const dragStart = useRef<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const events: Partial<HTMLEvents> = {
      mousedown: (e: MouseEvent) => {
        isDragging.current = true;

        dragStart.current = { x: e.x, y: e.y };

        invalidate();
      },
      mouseup: () => {
        isDragging.current = false;

        invalidate();
      },
      mousemove: (e: MouseEvent) => {
        if (isDragging.current) {
          const dragDelta: MousePosition = {
            x: e.movementX,
            y: e.movementY,
          };

          const translateAmount = Number(
            (-dragDelta.x * (dragSensitivity * camera.scale.x)).toFixed(1)
          );

          camera.translateX(translateAmount);
          camera.updateProjectionMatrix();

          invalidate();
        }
      },
    };

    Object.entries(events).forEach(([eventName, eventFunction]) =>
      canvas.addEventListener(
        eventName as keyof HTMLElementEventMap,
        eventFunction
      )
    );

    return () => {
      Object.entries(events).forEach(([eventName, eventFunction]) =>
        canvas.removeEventListener(
          eventName as keyof HTMLElementEventMap,
          eventFunction
        )
      );
    };
  }, [camera, canvas, dragSensitivity, invalidate]);

  return <></>;
};

export default DragControls;
