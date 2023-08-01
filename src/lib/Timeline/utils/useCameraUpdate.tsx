import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";

const useCameraUpdate = () => {
  const camera = useThree(({ camera }) => camera);

  const [lastCameraPos, setLastCameraPos] = useState({
    x: camera.position.x,
    y: camera.position.y,
  });
  const [lastCameraScale, setLastCameraScale] = useState(camera.scale.x);
  const [cameraUpdate, setCameraUpdate] = useState(camera);

  useFrame(() => {
    if (
      camera.position.x !== lastCameraPos.x ||
      camera.position.y !== lastCameraPos.y
    ) {
      setLastCameraPos({ x: camera.position.x, y: camera.position.y });
    }
    if (lastCameraScale !== camera.scale.x) {
      setLastCameraScale(camera.scale.x);
    }
  });

  useEffect(() => {
    setCameraUpdate(camera);
  }, [camera, lastCameraPos, lastCameraScale]);

  return cameraUpdate;
};

export default useCameraUpdate;
