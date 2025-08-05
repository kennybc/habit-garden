import { CAMERA_OFFSET, CHUNK_SIZE, TILE_SIZE } from "@/consts";
import * as THREE from "three";

export const pseudoNoise = (coord: Coordinate) => {
  const seed = coord.x * 374761393 + coord.z * 668265263;
  const t = (seed ^ (seed >> 13)) * 1274126177;
  return ((t ^ (t >> 16)) >>> 0) / 4294967296;
};

export const getChunkCoordinate = (x: number, z: number): Coordinate => {
  const tileX = Math.floor((x - CAMERA_OFFSET) / TILE_SIZE);
  const tileZ = Math.floor((z - CAMERA_OFFSET) / TILE_SIZE);

  const chunkX = Math.floor(tileX / CHUNK_SIZE);
  const chunkZ = Math.floor(tileZ / CHUNK_SIZE);

  return { x: chunkX, z: chunkZ };
};

export const generateChunk = (cx: number, cz: number): GardenTileProps[] => {
  const tiles: GardenTileProps[] = [];
  for (let gx = 0; gx < CHUNK_SIZE; gx++) {
    for (let gz = 0; gz < CHUNK_SIZE; gz++) {
      const worldX = cx * CHUNK_SIZE + gx;
      const worldZ = cz * CHUNK_SIZE + gz;

      const n = pseudoNoise({ x: worldX, z: worldZ });
      const hue = 70 + n * 60;
      const light = 65 + n * 15;
      const color = new THREE.Color(`hsl(${hue}, 70%, ${light}%)`);

      tiles.push({
        position: [worldX * TILE_SIZE, 0, worldZ * TILE_SIZE],
        rotation: [0, 0, 0],
        color,
      });
    }
  }

  return tiles;
};
