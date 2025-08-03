import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useState, useRef } from "react";
import { Tile } from "./Tile";

function IsoGrid({ size = 4, radius = 20 }) {
  const tiles = [];
  for (let gx = -radius; gx <= radius; gx++) {
    for (let gy = -radius; gy <= radius; gy++) {
      tiles.push(<Tile key={`${gx},${gy}`} gx={gx} gy={gy} size={size} />);
    }
  }
  return <>{tiles}</>;
}

export default function GardenCanvas() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(30);

  const [dragging, setDragging] = useState(false);

  const lastPointerPosition = useRef({ x: 0, y: 0 });
  const panMultiplier = 1 / zoom;

  return (
    <Canvas
      shadows
      style={{ background: "#dfefff", width: "100%", height: "100vh" }}
      onPointerUp={() => setDragging(false)}
      onPointerMove={(e) => {
        if (!dragging) return;
        const dx = e.clientX - lastPointerPosition.current.x;
        const dy = e.clientY - lastPointerPosition.current.y;
        setOffset((prev) => ({
          x: prev.x + dx * panMultiplier,
          y: prev.y + dy * panMultiplier,
        }));
        lastPointerPosition.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerDown={(e) => {
        setDragging(true);
        lastPointerPosition.current = { x: e.clientX, y: e.clientY };
      }}
      onWheel={(e) => {
        setZoom((prev) => Math.min(100, Math.max(10, prev + e.deltaY * -0.01)));
      }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />

      {/* Ortho camera in isometric view */}
      <OrthographicCamera
        makeDefault
        zoom={zoom}
        position={[50, 50, 50]}
        rotation={[-Math.atan(Math.sqrt(2)), Math.PI / 4, 0]}
      />

      {/* Pannable group */}
      <group position={[offset.x, 0, offset.y]}>
        <IsoGrid />
      </group>
    </Canvas>
  );
}
