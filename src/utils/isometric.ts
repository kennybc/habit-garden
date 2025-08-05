export const cartesianToIsometric = (coord: Coordinate): Coordinate => {
  return {
    x: coord.x - coord.z,
    z: (coord.x + coord.z) / 2,
  };
};
