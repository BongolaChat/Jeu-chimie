let points = [
  [12, 9],
  [11, 10],
  [10, 9],
  [11, 8],
  [12, 9],
  [11, 9],
];


const path = [
    [12, 9],
  [11, 10],
  [10, 9],
  [11, 8],
  [12, 9],
];

console.log(capturedPoints(path));

function capturedPoints(/** @type {Array<Number>} */ path){
    const topBound = Math.max(...path.map((b) => b[1]));
    const bottomBound = Math.min(...path.map((b) => b[1]));
    const leftBound = Math.min(...path.map((b) => b[0]));
    const rightBound = Math.max(...path.map((b) => b[0]));
    console.log("topBound ", topBound);
    console.log("bottomBound ", bottomBound);
    console.log("leftBound ", leftBound);
    console.log("rightBound ", rightBound);

    let captures = [];

    for (let x = leftBound + 1; x < leftBound + Math.abs(rightBound - leftBound); x++) {
        for (let y = bottomBound + 1; y < bottomBound + Math.abs(topBound - bottomBound); y++) {
            captures.push([x, y]);
        }
    }
    return captures;
}
