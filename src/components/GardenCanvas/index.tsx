import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useState, useRef } from "react";
import { GardenTerrain } from "./GardenTerrain";
import { Grid } from "../Grid";
import { CAMERA_OFFSET } from "@/consts";

const GardenCanvas = () => {
  const [offset, setOffset] = useState<Coordinate>({ x: 0, z: 0 });
  const [zoom, setZoom] = useState(25);

  const [dragging, setDragging] = useState(false);

  const lastPointerPosition = useRef<Coordinate>({ x: 0, z: 0 });
  const panMultiplier = 1 / -zoom;

  return (
    <Canvas
      shadows
      style={{ background: "#dfefff", width: "100%", height: "100vh" }}
      onPointerUp={() => setDragging(false)}
      onPointerMove={(e) => {
        if (!dragging) return;
        const dx = e.clientX - lastPointerPosition.current.x;
        const dz = e.clientY - lastPointerPosition.current.z;
        setOffset((prev) => ({
          x: prev.x + dx * panMultiplier,
          z: prev.z + dz * panMultiplier,
        }));
        lastPointerPosition.current = { x: e.clientX, z: e.clientY };
      }}
      onPointerDown={(e) => {
        setDragging(true);
        lastPointerPosition.current = { x: e.clientX, z: e.clientY };
      }}
      onWheel={(e) => {
        setZoom((prev) => Math.min(30, Math.max(20, prev + e.deltaY * -0.01)));
      }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />

      {/* Ortho camera in isometric view */}
      <OrthographicCamera
        makeDefault
        zoom={zoom}
        position={[offset.x, CAMERA_OFFSET, offset.z]}
        rotation={[Math.atan(-1 / Math.sqrt(2)), Math.PI / 4, Math.PI / 8]}
      />

      <GardenTerrain />
      <Grid />
    </Canvas>
  );
};

export default GardenCanvas;
