import { Instance, Instances } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RENDER_DISTANCE, TILE_SIZE } from "@/consts";
import { generateChunk, getChunkCoordinate } from "@/utils/chunking";
import { useFrame, useThree } from "@react-three/fiber";

interface GardenTileProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: THREE.Color;
}

export const GardenTerrain = () => {
  const [chunks, setChunks] = useState<Map<string, GardenTileProps[]>>(
    new Map()
  );
  const lastChunk = useRef<Coordinate | null>(null);
  const { camera } = useThree();

  useFrame(() => {
    const { x: cx, z: cz } = getChunkCoordinate(
      camera.position.x,
      camera.position.z
    );

    console.log(cx, cz);

    // Only regenerate if chunk changed
    if (
      !lastChunk.current ||
      lastChunk.current.x !== cx ||
      lastChunk.current.z !== cz
    ) {
      const newChunks = new Map(chunks);

      for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
        for (let dz = -RENDER_DISTANCE; dz <= RENDER_DISTANCE; dz++) {
          const key = `${cx + dx}_${cz + dz}`;
          if (!newChunks.has(key)) {
            newChunks.set(key, generateChunk(cx + dx, cz + dz));
          }
        }
      }

      // Drop far-away chunks
      for (const key of newChunks.keys()) {
        const [kx, kz] = key.split("_").map(Number);
        const dist = Math.round(
          Math.sqrt(Math.pow(kx - cx, 2) + Math.pow(kz - cz, 2))
        );
        if (dist > RENDER_DISTANCE) {
          newChunks.delete(key);
        }
      }

      setChunks(newChunks);
      lastChunk.current = { x: cx, z: cz };
    }
  });

  // Flatten all tiles
  const tiles = useMemo(() => {
    const arr: GardenTileProps[] = [];
    chunks.forEach((t) => arr.push(...t));
    return arr;
  }, [chunks]);

  return (
    <Instances limit={4000} castShadow receiveShadow>
      <boxGeometry args={[TILE_SIZE, TILE_SIZE / 2, TILE_SIZE]} />
      <meshStandardMaterial />
      {tiles.map((props, i) => (
        <Instance
          key={i}
          onClick={() => console.log(props.position)}
          {...props}
        />
      ))}
    </Instances>
  );
};
