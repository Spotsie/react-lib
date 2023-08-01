import { useRef, useEffect } from "react";
import { ThreeEvent, useThree } from "@react-three/fiber";
import React from "react";
import { Vector3 } from "three";
import { getBufferGeometryFromPoints } from "../TimelineTracks";

interface Props {
  clamp?: {
    start: number;
    end: number;
  };
  dragSensitivity: number;
}

interface HTMLEvents {
  [eventName: string]: (e: any) => void;
}

const DragControls = ({ clamp, dragSensitivity }: Props) => {
  const { gl, camera, invalidate } = useThree(({ camera, gl, invalidate }) => ({
    gl,
    camera,
    invalidate,
  }));

  const canvas = gl.domElement;

  const isDragging = useRef(false);
  const previousTouch = useRef<Touch | null>(null);

  const onmousedown = () => {
    isDragging.current = true;
  };
  const onmousemove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) {
      return;
    }

    const dragDeltaX = e.movementX;

    const translateAmount = Number(
      (-dragDeltaX * (dragSensitivity * camera.scale.x)).toFixed(1)
    );

    if (!clamp) {
      camera.translateX(translateAmount);
    } else if (
      camera.position.x -
        (canvas.clientWidth * camera.scale.x) / 2 +
        translateAmount <
      clamp.start
    ) {
      camera.position.setX(
        clamp.start + (canvas.clientWidth * camera.scale.x) / 2
      );
    } else if (
      camera.position.x +
        (canvas.clientWidth * camera.scale.x) / 2 +
        translateAmount >
      clamp.end
    ) {
      camera.position.setX(
        clamp.end - (canvas.clientWidth * camera.scale.x) / 2
      );
    } else {
      camera.translateX(translateAmount);
    }

    camera.updateProjectionMatrix();

    invalidate();
  };

  useEffect(() => {
    const documentEvents: HTMLEvents = {
      mouseup: () => {
        isDragging.current = false;
      },
      touchend: () => {
        previousTouch.current = null;
      },
    };
    Object.entries(documentEvents).forEach(([eventName, eventFunction]) =>
      document.addEventListener(
        eventName as keyof HTMLElementEventMap,
        eventFunction
      )
    );

    return () => {
      Object.entries(documentEvents).forEach(([eventName, eventFunction]) =>
        document.removeEventListener(
          eventName as keyof HTMLElementEventMap,
          eventFunction
        )
      );
    };
  }, []);

  return (
    <mesh
      position={new Vector3(0, 0, 2.5)}
      geometry={getBufferGeometryFromPoints(
        -1000,
        Number.MAX_SAFE_INTEGER,
        10000,
        -10000
      )}
      onPointerDown={onmousedown}
      onPointerMove={onmousemove}
      visible={false}
    />
  );
};

export default DragControls;
