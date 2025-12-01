const line = document.getElementById("line");
const rect = document.getElementById("rect");
const circle = document.getElementById("circle");
const solRect = document.getElementById("solidRect");
const solCircle = document.getElementById("solidCircle");

let lineTrack = false;
let lineSX = 0;
let lineSY = 0;
let rectTrack = false;
let circleTrack = false;
let solRectTrack = false;
let solCircleTrack = false;

let canvasHist = []; //總歷史

let shapeHist = [];
let rectHist = [];

function copyNPaste(copyArr, pasteArr) {
  const copy = JSON.parse(JSON.stringify(copyArr));
  pasteArr.push(copy);
}

function drawDefault(mouse) {
  const cvCoord = canvas.getBoundingClientRect();
  let x = mouse.clientX - cvCoord.left;
  let y = mouse.clientY - cvCoord.top;
  if (!snapMode) {
    if (lineTrack === true) {
      lineSX = x;
      lineSY = y;
      canvas.removeEventListener("click", drawDefault);
      canvas.addEventListener("click", endPoint);
    } else if (rectTrack === true) {
      drawRect(x, y, 55, 55, currColor, currSize);
      shapeHist.push({
        shape: "rect",
        x: x,
        y: y,
        w: 55,
        h: 55,
        color: currColor,
        bs: currSize,
        ff: false,
      });
      redoList.length = 0;
      copyNPaste(shapeHist, canvasHist);
      rectTrack = false;
    } else if (circleTrack === true) {
      drawCircle(x, y, 35, currColor, currSize);
      shapeHist.push({
        shape: "circle",
        x: x,
        y: y,
        r: 35,
        color: currColor,
        bs: currSize,
        ff: false,
      });
      redoList.length = 0;
      copyNPaste(shapeHist, canvasHist);
      circleTrack = false;
    } else if (solRectTrack === true) {
      drawSolRect(x, y, 55, 55, currColor, currSize);
      shapeHist.push({
        shape: "rect",
        x: x,
        y: y,
        w: 55,
        h: 55,
        color: currColor,
        bs: currSize,
        ff: true,
      });
      redoList.length = 0;
      copyNPaste(shapeHist, canvasHist);
      solRectTrack = false;
    } else if (solCircleTrack === true) {
      drawSolCircle(x, y, 35, currColor, currSize);
      shapeHist.push({
        shape: "circle",
        x: x,
        y: y,
        r: 35,
        color: currColor,
        bs: currSize,
        ff: true,
      });
      redoList.length = 0;
      copyNPaste(shapeHist, canvasHist);
      solCircleTrack = false;
    }
  } else {
    if (lineTrack === true) {
      lineSX = snapXY.x;
      lineSY = snapXY.y;
      canvas.removeEventListener("click", drawDefault);
      canvas.addEventListener("click", endPoint);
    } else if (rectTrack === true) {
      drawRect(snapXY.x - 25, snapXY.y - 25, 50, 50, currColor, currSize);
      shapeHist.push({
        shape: "rect",
        x: snapXY.x - 25,
        y: snapXY.y - 25,
        w: 50,
        h: 50,
        color: currColor,
        bs: currSize,
        ff: false,
      });
      redoList.length = 0;
      copyNPaste(shapeHist, canvasHist);
      rectTrack = false;
    } else if (circleTrack === true) {
      drawCircle(snapXY.x, snapXY.y, 35, currColor, currSize);
      shapeHist.push({
        shape: "circle",
        x: snapXY.x,
        y: snapXY.y,
        r: 35,
        color: currColor,
        bs: currSize,
        ff: false,
      });
      redoList.length = 0;
      copyNPaste(shapeHist, canvasHist);
      circleTrack = false;
    } else if (solRectTrack === true) {
      drawSolRect(snapXY.x - 25, snapXY.y - 25, 50, 50, currColor, currSize);
      shapeHist.push({
        shape: "rect",
        x: snapXY.x - 25,
        y: snapXY.y - 25,
        w: 50,
        h: 50,
        color: currColor,
        bs: currSize,
        ff: true,
      });
      redoList.length = 0;
      copyNPaste(shapeHist, canvasHist);
      solRectTrack = false;
    } else if (solCircleTrack === true) {
      drawSolCircle(snapXY.x, snapXY.y, 35, currColor, currSize);
      shapeHist.push({
        shape: "circle",
        x: snapXY.x,
        y: snapXY.y,
        r: 35,
        color: currColor,
        bs: currSize,
        ff: true,
      });
      redoList.length = 0;
      copyNPaste(shapeHist, canvasHist);
      solCircleTrack = false;
    }
  }
}

function endPoint(mouse) {
  const cvCoord = canvas.getBoundingClientRect();
  let lineEX = null;
  let lineEY = null;
  if (lineTrack === true) {
    if (!snapMode) {
      lineEX = mouse.clientX - cvCoord.left;
      lineEY = mouse.clientY - cvCoord.top;
      drawLine(lineSX, lineSY, lineEX, lineEY, currColor, currSize);
    } else {
      lineEX = snapXY.x;
      lineEY = snapXY.y;
      drawLine(lineSX, lineSY, lineEX, lineEY, currColor, currSize);
    }
    shapeHist.push({
      shape: "line",
      sx: lineSX,
      sy: lineSY,
      ex: lineEX,
      ey: lineEY,
      color: currColor,
      bs: currSize,
    });
    redoList.length = 0;
    copyNPaste(shapeHist, canvasHist);
    lineTrack = false;
    canvas.removeEventListener("click", endPoint);
    canvas.addEventListener("click", drawDefault);
  }
}

//功能鍵
line.addEventListener("click", () => {
  lineTrack = true;
  doodleMode = false;
  eraseMode = false;
  canvas.removeEventListener("click", drawDefault);
  canvas.addEventListener("click", drawDefault);
});
rect.addEventListener("click", () => {
  rectTrack = true;
  doodleMode = false;
  eraseMode = false;
  canvas.removeEventListener("click", drawDefault);
  canvas.addEventListener("click", drawDefault);
});
circle.addEventListener("click", () => {
  circleTrack = true;
  doodleMode = false;
  eraseMode = false;
  canvas.removeEventListener("click", drawDefault);
  canvas.addEventListener("click", drawDefault);
});
solRect.addEventListener("click", () => {
  solRectTrack = true;
  doodleMode = false;
  eraseMode = false;
  canvas.removeEventListener("click", drawDefault);
  canvas.addEventListener("click", drawDefault);
});
solCircle.addEventListener("click", () => {
  solCircleTrack = true;
  doodleMode = false;
  eraseMode = false;
  canvas.removeEventListener("click", drawDefault);
  canvas.addEventListener("click", drawDefault);
});
