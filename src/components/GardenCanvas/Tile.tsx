import { Instance, Instances, Merged } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { FC } from "react";
import { TILE_SIZE } from "@/consts";

export const pseudoNoise = (x: number, y: number) => {
  const seed = x * 374761393 + y * 668265263;
  const t = (seed ^ (seed >> 13)) * 1274126177;
  return ((t ^ (t >> 16)) >>> 0) / 4294967296;
};

interface TileProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: THREE.Color;
}

interface GardenGridProps {
  range?: number;
}

export const GardenGrid: FC<GardenGridProps> = ({ range = 20 }) => {
  const tiles = useMemo(() => {
    const list: { key: string; props: Partial<TileProps> }[] = [];
    for (let gx = -range; gx < range; gx++) {
      for (let gy = -range; gy < range; gy++) {
        const n = pseudoNoise(gx, gy);
        const hue = 180 + n * 60;
        const light = 65 + n * 15;
        const color = new THREE.Color(`hsl(${hue}, 60%, ${light}%)`);
        list.push({
          key: `${gx}-${gy}`,
          props: {
            position: [
              (gx - gy) * (TILE_SIZE / 2),
              (gx + gy) * 1e-4,
              (gx + gy) * (TILE_SIZE / 4),
            ],
            rotation: [-Math.PI / 2, 0, 0],
            color,
          },
        });
      }
    }
    return list;
  }, [range]);

  return (
    <Instances limit={4000} castShadow receiveShadow>
      <planeGeometry args={[TILE_SIZE, TILE_SIZE]} />
      <meshStandardMaterial />
      {tiles.map(({ key, props }) => (
        <Instance key={key} {...props} />
      ))}
    </Instances>
  );
};
