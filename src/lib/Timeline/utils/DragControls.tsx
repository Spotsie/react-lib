import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import React from "react";

interface Props {
  dragSensitivity: number;
}

interface HTMLEvents {
  [eventName: string]: (e: any) => void;
}

const DragControls = ({ dragSensitivity }: Props) => {
  const { gl, camera, invalidate } = useThree(({ camera, gl, invalidate }) => ({
    gl,
    camera,
    invalidate,
  }));
  const canvas = gl.domElement;

  const isDragging = useRef(false);
  const previousTouch = useRef<Touch | null>(null);

  useEffect(() => {
    const canvasEvents: HTMLEvents = {
      mousedown: () => {
        isDragging.current = true;
      },
      mousemove: (e: MouseEvent) => {
        if (!isDragging.current) {
          return;
        }

        const dragDeltaX = e.movementX;

        const translateAmount = Number(
          (-dragDeltaX * (dragSensitivity * camera.scale.x)).toFixed(1)
        );

        camera.translateX(translateAmount);
        camera.updateProjectionMatrix();

        invalidate();
      },

      touchmove: (e: TouchEvent) => {
        e.preventDefault();

        const touch = e.touches[0];

        if (!previousTouch.current) {
          previousTouch.current = touch;
        }

        const movementX = touch.pageX - previousTouch.current.pageX;

        const translateAmount = Number(
          (-movementX * (dragSensitivity * camera.scale.x)).toFixed(1)
        );

        camera.translateX(translateAmount);
        camera.updateProjectionMatrix();

        invalidate();

        previousTouch.current = touch;
      },
    };

    const documentEvents: HTMLEvents = {
      mouseup: () => {
        isDragging.current = false;
      },
      touchend: () => {
        previousTouch.current = null;
      },
    };

    Object.entries(canvasEvents).forEach(([eventName, eventFunction]) =>
      canvas.addEventListener(
        eventName as keyof HTMLElementEventMap,
        eventFunction
      )
    );

    Object.entries(documentEvents).forEach(([eventName, eventFunction]) =>
      document.addEventListener(
        eventName as keyof HTMLElementEventMap,
        eventFunction
      )
    );

    return () => {
      Object.entries(canvasEvents).forEach(([eventName, eventFunction]) =>
        canvas.removeEventListener(
          eventName as keyof HTMLElementEventMap,
          eventFunction
        )
      );

      Object.entries(documentEvents).forEach(([eventName, eventFunction]) =>
        document.removeEventListener(
          eventName as keyof HTMLElementEventMap,
          eventFunction
        )
      );
    };
  }, [camera, canvas, dragSensitivity, invalidate]);

  return <></>;
};

export default DragControls;
