import * as THREE from "three";

export const pseudoNoise = (x: number, y: number) => {
  const seed = x * 374761393 + y * 668265263;
  const t = (seed ^ (seed >> 13)) * 1274126177;
  return ((t ^ (t >> 16)) >>> 0) / 4294967296;
};

export const Tile = ({
  gx,
  gy,
  size,
}: {
  gx: number;
  gy: number;
  size: number;
}) => {
  const n = pseudoNoise(gx, gy);
  const hue = 180 + n * 60;
  const light = 65 + n * 15;
  const color = new THREE.Color(`hsl(${hue}, 60%, ${light}%)`);

  return (
    <mesh
      position={[
        (gx - gy) * (size / 2),
        0.001 * (gx + gy),
        (gx + gy) * (size / 4), // isometric depth
      ]}
      rotation={[-Math.PI / 2, 0, 0]} // rotate plane to lay flat
    >
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial
        color={color}
        polygonOffset
        polygonOffsetFactor={1}
        polygonOffsetUnits={1}
      />
    </mesh>
  );
};
