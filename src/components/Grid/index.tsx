import { CAMERA_OFFSET, CHUNK_SIZE, TILE_SIZE } from "@/consts";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Grid = () => {
  const gridRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    // Change the rotation order BEFORE applying rotations
    gridRef.current.rotation.order = "YXZ";

    // Example: rotate 45° around Y, then 30° around X
    gridRef.current.rotation.y = Math.PI / 2;
    gridRef.current.rotation.x = Math.PI / 2;
  }, []);

  return (
    <mesh ref={gridRef} position={[TILE_SIZE, 0, TILE_SIZE]}>
      <planeGeometry
        args={[
          100,
          100,
          100 / (TILE_SIZE * CHUNK_SIZE),
          100 / (TILE_SIZE * CHUNK_SIZE),
        ]}
      />
      <meshBasicMaterial wireframe transparent opacity={0.1} color={"#000"} />
    </mesh>
  );
};
