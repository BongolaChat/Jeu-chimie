var points = [
  [5, 5],
  [4, 4],
  //   [6, 4],
  [6, 5],
  [6, 3],
  [5, 3],
  [8, 10],
  [7, 5],
  [7, 3],
  [8, 4],
];

// for (let i = 0; i < points.length; i++) {
// }
const point = points[2];

console.log("Point: ", point, " has Path: ", findPaths(point[0], point[1]));

function findPaths(x, y, prev = []) {
  let paths = [];
  let neighbors = findNeighbors(x, y, points).filter(
    (neighbor) =>
      !prev.find((x) => x[0] === neighbor[0] && x[1] === neighbor[1])
  );

  if (neighbors.length === 0 && prev.length !== 0) {
    let firstPoint = prev[0];
    if (
      !!findNeighbors(x, y, points).find(
        (n) => n[0] === firstPoint[0] && n[1] === firstPoint[1]
      )
    ) {
      return [[...prev, [x, y], firstPoint]];
    }
    return [[...prev, [x, y]]];
  } else if (
    prev.length >= 3 &&
    !!findNeighbors(x, y, points).find(
      (n) => n[0] === firstPoint[0] && n[1] === firstPoint[1]
    )
  ) {
    let firstPoint = prev[0];
    return [[...prev, [x, y], firstPoint]];
  }
  for (let i in neighbors) {
    const neighbor = neighbors[i];
    paths.push(...findPaths(neighbor[0], neighbor[1], [...prev, [x, y]]));
  }
  return paths.filter((p) => validPath(p));
}

function findNeighbors(x, y, points) {
  return [
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y - 1],
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x + 1, y + 1],
    [x - 1, y + 1],
  ].filter(
    (neighbor) =>
      !!points.find((x) => x[0] === neighbor[0] && x[1] === neighbor[1])
  );
}

function validPath(history) {
  if (history.length < 4) return false;
  return true;
}
