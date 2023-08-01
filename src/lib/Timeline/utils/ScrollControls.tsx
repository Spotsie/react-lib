import { useEffect, useRef, useState } from "react";
import {
  Object3DNode,
  ThreeEvent,
  useFrame,
  useThree,
} from "@react-three/fiber";
import React from "react";
import { Mesh, Vector3 } from "three";
import { motion } from "framer-motion-3d";
import { getBufferGeometryFromPoints } from "../TimelineTracks";

interface Props {
  zoomSensitivity: number;

  maxScroll: number;
  timeFrame: { start: number; end: number };
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 1200;

const ScrollControls = ({ zoomSensitivity, maxScroll, timeFrame }: Props) => {
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

      const isCtrlPressed = e.ctrlKey;

      if (!isCtrlPressed) {
        const isOverMaxHeight = maxScroll <= canvas.clientHeight;
        if (isOverMaxHeight) {
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

        const clampedScale = clamp({
          num: newScale,
          min: MIN_SCALE,
          max: MAX_SCALE,
        });
        const maxScale = (timeFrame.end - timeFrame.start) / canvas.clientWidth;

        if (clampedScale === maxScale) {
          return;
        } else if (clampedScale >= maxScale) {
          camera.scale.setX(maxScale);
        } else {
          camera.scale.setX(clampedScale);
        }

        // Update the world matrix before calculating new positions
        camera.updateMatrixWorld(true);
        const screenWidth = (canvas.clientWidth * camera.scale.x) / 2;
        const isViewBeforeStart =
          timeFrame.start >
          camera.position.x - (canvas.clientWidth * camera.scale.x) / 2;
        const isViewAfterEnd = camera.position.x + screenWidth > timeFrame.end;

        if (isViewBeforeStart || isViewAfterEnd) {
          if (isViewBeforeStart) {
            camera.position.setX(timeFrame.start + screenWidth);
          }
          if (isViewAfterEnd) {
            camera.position.setX(timeFrame.end - screenWidth);
          }
        } else {
          // Get new world mouse coords and offset with the previous mouse coords
          const newObjectPos = camera.localToWorld(
            new Vector3(currDistanceMouseFromCenter)
          );
          const newDistanceFromMouseToCenter =
            newObjectPos.x - camera.position.x;
          const newCameraPosition =
            currObjectPosition.x - newDistanceFromMouseToCenter;

          camera.position.setX(newCameraPosition);
        }
      }

      camera.updateProjectionMatrix();
      camera.updateMatrix();
      invalidate();
    };
    canvas.addEventListener("wheel", zoomEvent);

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
    canvas.addEventListener("touchend", dragUpEvent);
    canvas.addEventListener("touchmove", dragEvent);

    return () => {
      canvas.removeEventListener("wheel", zoomEvent);
      canvas.removeEventListener("touchend", dragUpEvent);
      canvas.removeEventListener("touchmove", dragEvent);
    };
  }, [camera, canvas, zoomSensitivity, invalidate, maxScroll]);

  const meshRef = useRef<Object3DNode<Mesh, typeof Mesh>>(null);

  const dragPosition = useRef(false);

  const startDrag = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    dragPosition.current = true;
  };
  const stopDrag = () => {
    dragPosition.current = false;
  };
  useEffect(() => {
    window.addEventListener("pointerup", stopDrag);

    return () => {
      window.removeEventListener("pointerup", stopDrag);
    };
  }, []);

  const sliderHeight = 35;

  const containerMeshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!meshRef.current || !containerMeshRef.current) {
      return;
    }
    const screenWidth = gl.domElement.clientWidth * camera.scale.x;
    const sliderWidth =
      screenWidth / ((timeFrame.end - timeFrame.start) / screenWidth);

    const cameraMinView = camera.position.x - screenWidth / 2;

    const minRange = timeFrame.start;

    const offset = cameraMinView - minRange;

    let screenOffset =
      (offset * (screenWidth - sliderWidth)) /
      (timeFrame.end - timeFrame.start - screenWidth);
    if (offset === 0) {
      screenOffset = 0;
    }

    meshRef.current.geometry = getBufferGeometryFromPoints(
      -sliderWidth / 2,
      sliderWidth / 2,
      sliderHeight,
      0
    );

    (meshRef.current.position as Vector3).set(
      cameraMinView + screenOffset + sliderWidth / 2,
      -gl.domElement.clientHeight / 2 + camera.position.y,
      2.9
    );

    (containerMeshRef.current.position as Vector3).set(
      camera.position.x - screenWidth / 2,
      -gl.domElement.clientHeight / 2 + camera.position.y,
      2.8
    );

    containerMeshRef.current.geometry = getBufferGeometryFromPoints(
      -screenWidth,
      screenWidth * 2,
      sliderHeight,
      0
    );
  });

  const handleOnClickSliderBar = (e: ThreeEvent<PointerEvent>) => {
    if (dragPosition.current) {
      return;
    }
    const screenWidth = gl.domElement.clientWidth * camera.scale.x;
    const sliderWidth =
      screenWidth / ((timeFrame.end - timeFrame.start) / screenWidth);

    e.stopPropagation();
    const screenOffset = clamp({
      num: ((e as any).layerX * camera.scale.x) as number,
      min: sliderWidth / 2,
      max: screenWidth - sliderWidth / 2,
    });

    const offsetPercentage =
      (screenOffset - sliderWidth / 2) / (screenWidth - sliderWidth);

    const newPos =
      timeFrame.start +
      screenWidth / 2 +
      (timeFrame.end - timeFrame.start - screenWidth) * offsetPercentage;
    camera.position.setX(newPos);
    dragPosition.current = true;
    invalidate();
  };

  const move = (e: ThreeEvent<PointerEvent>) => {
    if (!dragPosition.current) {
      return;
    }
    const screenWidth = gl.domElement.clientWidth * camera.scale.x;
    const sliderWidth =
      screenWidth / ((timeFrame.end - timeFrame.start) / screenWidth);

    const newPos =
      (e.nativeEvent.movementX * camera.scale.x * screenWidth) / sliderWidth;
    if (camera.position.x + newPos > timeFrame.end - screenWidth / 2) {
      camera.position.setX(timeFrame.end - screenWidth / 2);
    } else if (camera.position.x + newPos < timeFrame.start + screenWidth / 2) {
      camera.position.setX(timeFrame.start + screenWidth / 2);
    } else {
      camera.translateX(newPos);
    }

    invalidate();
  };

  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <mesh
        position={new Vector3(0, 0, 2.5)}
        geometry={getBufferGeometryFromPoints(
          -1000,
          Number.MAX_SAFE_INTEGER,
          10000,
          -10000
        )}
        onPointerMove={move}
        visible={false}
      />

      <mesh
        position={new Vector3(0, -gl.domElement.clientHeight / 2, 2.8)}
        ref={containerMeshRef}
        onPointerDown={handleOnClickSliderBar}
      >
        <meshBasicMaterial color="#d4e4fa" />
      </mesh>

      <motion.mesh
        position={new Vector3(0, -gl.domElement.clientHeight / 2, 2.9)}
        onPointerDown={startDrag}
        onPointerUp={stopDrag}
        ref={meshRef}
        animate={
          dragPosition.current
            ? "dragging"
            : isHovering
            ? "hovering"
            : "notHovering"
        }
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={() => setIsHovering(false)}
      >
        <motion.meshBasicMaterial
          transition={{ duration: 0.15 }}
          onUpdate={() => invalidate()}
          variants={{
            dragging: { color: "#606060" },
            hovering: {
              color: "#808080",
            },
            notHovering: {
              color: "#909090",
            },
          }}
        />
      </motion.mesh>
    </>
  );
};

export default ScrollControls;
const clamp = ({ num, min, max }: { num: number; min: number; max: number }) =>
  Math.min(Math.max(num, min), max);
