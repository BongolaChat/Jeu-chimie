const lineSize = { width: 20, height: 20 };
var points = [];
var pathsPoints = [];
var pointfillColor = "red";

document.addEventListener("DOMContentLoaded", function () {
  /** @type {HTMLCanvasElement} */
  var canvas = document.getElementById("canvas");

  /** @type {CanvasRenderingContext2D} */
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  render();

  canvas.addEventListener("mousedown", function (event) {
    let x = Math.round(
      event.offsetX / (canvas.width / Math.abs(canvas.width / lineSize.width))
    );
    let y = Math.round(
      event.offsetY / (canvas.height / Math.abs(canvas.width / lineSize.height))
    );
    if (
      points.filter(function (point) {
        return point.x === x && point.y === y;
      }).length !== 0
    )
      return;
    points.push({ x, y, pointfillColor });
    pointfillColor = pointfillColor === "red" ? "blue" : "red";

    render();
  });

  // setInterval(render, 1000 / 60);

  function render() {
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(0, 0);
    ctx.stroke();

    for (let x = 1; x < Math.abs(canvas.width / lineSize.width); x++) {
      ctx.strokeStyle = "blue";
      ctx.beginPath();
      ctx.moveTo(lineSize.width * x, 0);
      ctx.lineTo(lineSize.width * x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < Math.abs(canvas.height / lineSize.height); y++) {
      ctx.strokeStyle = "blue";
      ctx.beginPath();
      ctx.moveTo(0, lineSize.height * y);
      ctx.lineTo(canvas.width, lineSize.height * y);
      ctx.stroke();
    }

    for (let i = 0; i < points.length; i++) {
      let point = points[i];
      ctx.fillStyle = point.pointfillColor.replace("-captured", "");
      ctx.beginPath();
      ctx.arc(
        lineSize.width * point.x,
        lineSize.height * point.y,
        lineSize.width * 0.3,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.fill();

      // close path
      if (!!pathsPoints.find((p) => p[0] === point.x && p[1] === point.y)) continue;
      let paths = findPaths(point.x, point.y, point.pointfillColor);
      console.log("Paths ", paths);
      for (let j = 0; j < paths.length; j++) {
        const path = paths[j];
        console.log("One Path ", path);
        pathsPoints.push(...path.filter((p) => !pathsPoints.find((_p) => _p[0] === p[0] && _p[1] === p[1])));

        let captureds = capturedPoints(path, point.pointfillColor);

        console.log("capturedPoints ", captureds.length);
        if (captureds.length === 0) continue;
        let firstPoint = path[0];
        ctx.strokeStyle = point.pointfillColor;
        ctx.beginPath();
        ctx.moveTo(
          lineSize.width * firstPoint[0],
          lineSize.height * firstPoint[1]
        );
        for (let k = 1; k < path.length; k++) {
          const pathPoint = path[k];
          ctx.lineTo(
            lineSize.height * pathPoint[0],
            lineSize.height * pathPoint[1]
          );
        }
        ctx.closePath();
        ctx.stroke();
        // remove captured points
        for (let l = 0; l < captureds.length; l++) {
          const captured = captureds[l];
          let pointCapturedIndex = points.findIndex((point) => point.x == captured[0] && point.y === captured[1]);
          let pointCaptured = points.find((point) => point.x == captured[0] && point.y === captured[1]);
          points.splice(pointCapturedIndex, 1, { x: captured[0], y: captured[1], pointfillColor:  pointCaptured.pointfillColor.startsWith("blue") ? "blue-captured" : "red-captured" });
        }
      }
    }
  }
});

function findPaths(x, y, color, prev = []) {
  let paths = [];
  let neighbors = findNeighbors(x, y, color, points).filter(
    (neighbor) =>
      !prev.find((x) => x[0] === neighbor[0] && x[1] === neighbor[1])
  );

  if (neighbors.length === 0 && prev.length !== 0) {
    let firstPoint = prev[0];
    if (
      !!findNeighbors(x, y, color, points).find(
        (n) => n[0] === firstPoint[0] && n[1] === firstPoint[1]
      )
    ) {
      return [[...prev, [x, y], firstPoint]];
    }
    return [[...prev, [x, y]]];
  } else if (prev.length >= 3) {
    let firstPoint = prev[0];
    if (
      !!findNeighbors(x, y, color, points).find(
        (n) => n[0] === firstPoint[0] && n[1] === firstPoint[1]
      )
    ) {
      return [[...prev, [x, y], firstPoint]];
    }
  }
  for (let i in neighbors) {
    const neighbor = neighbors[i];
    paths.push(
      ...findPaths(neighbor[0], neighbor[1], color, [...prev, [x, y]])
    );
  }
  return paths.filter((p) => validPath(p));
}

function findNeighbors(x, y, color, points) {
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
      !!points.find(
        (point) =>
          point.x === neighbor[0] &&
          point.y === neighbor[1] &&
          point.pointfillColor === color
      )
  );
}

function validPath(path) {
  if (path.length < 4) return false;
  if (path[0] !== path[path.length - 1]) return false;
  return true;
}

function capturedPoints(/** @type {Array<Number>} */ path, color) {
  const topBound = Math.max(...path.map((b) => b[1]));
  const bottomBound = Math.min(...path.map((b) => b[1]));
  const leftBound = Math.min(...path.map((b) => b[0]));
  const rightBound = Math.max(...path.map((b) => b[0]));
  console.log("topBound ", topBound);
  console.log("bottomBound ", bottomBound);
  console.log("leftBound ", leftBound);
  console.log("rightBound ", rightBound);

  let captures = [];

  for (
    let x = leftBound + 1;
    x < leftBound + Math.abs(rightBound - leftBound);
    x++
  ) {
    for (
      let y = bottomBound + 1;
      y < bottomBound + Math.abs(topBound - bottomBound);
      y++
    ) {
      captures.push([x, y]);
    }
  }
  return captures.filter(
    (capture) =>
      !!points.find(
        (point) =>
          point.x === capture[0] &&
          point.y === capture[1] &&
          point.pointfillColor !== color
      )
  );
}
