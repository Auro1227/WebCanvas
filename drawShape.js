const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");

function drawLine(sx, sy, ex, ey, color, bs) {
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.strokeStyle = color;
  ctx.lineWidth = bs;
  ctx.stroke();
}

function drawCircle(x, y, r, color, bs) {
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.strokeStyle = color;
  ctx.lineWidth = bs;
  ctx.stroke();
}

function drawRect(x, y, w, h, color, bs) {
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = bs;
  ctx.strokeRect(x, y, w, h);
}

function drawSolCircle(x, y, r, color, bs) {
  ctx.setLineDash([]);
  ctx.fillStyle = color;
  ctx.lineWidth = bs;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}

function drawSolRect(x, y, w, h, color, bs) {
  ctx.setLineDash([]);
  ctx.fillStyle = color;
  ctx.lineWidth = bs;
  ctx.beginPath();
  ctx.fillRect(x, y, w, h);
}

function dottedRect(x, y, w, h, bc) {
  ctx.beginPath();
  ctx.setLineDash([5, 3]);
  ctx.strokeStyle = bc;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
  ctx.fillStyle = "grey";
  ctx.fillRect(x - 2, y - 2, 5, 5);
  rectHist.push({ type: "tl", x: x - 2, y: y - 2, w: 5, h: 5 });
  ctx.fillRect(x + w - 3, y - 2, 5, 5);
  rectHist.push({
    type: "tr",
    x: x + w - 3,
    y: y - 2,
    w: 5,
    h: 5,
  });
  ctx.fillRect(x - 2, y + h - 2, 5, 5);
  rectHist.push({
    type: "dl",
    x: x - 2,
    y: y + h - 2,
    w: 5,
    h: 5,
  });
  ctx.fillRect(x + w - 3, y + h - 2, 5, 5);
  rectHist.push({
    type: "dr",
    x: x + w - 3,
    y: y + h - 2,
    w: 5,
    h: 5,
  });
}

function lineSelect(sx, sy, ex, ey) {
  ctx.fillStyle = "grey";
  ctx.fillRect(sx - 5, sy - 2, 5, 5);
  rectHist.push({
    type: "tl",
    x: sx - 5,
    y: sy - 2,
    w: 5,
    h: 5,
  });
  ctx.fillRect(ex, ey - 2, 5, 5);
  rectHist.push({
    type: "tr",
    x: ex,
    y: ey - 2,
    w: 5,
    h: 5,
  });
}

function drawCross(x, y, color) {
  drawLine(x - 3, y, x + 3, y, color, 2);
  drawLine(x, y - 3, x, y + 3, color, 2);
}

let gridRow = null;
let gridCol = null;
let crossHist = [];

function drawGrid(size) {
  if (size <= 0) return;
  const canvasW = 1200;
  const canvasH = 600;
  gridRow = Math.floor(canvasH / size);
  gridCol = Math.floor(canvasW / size);
  crossHist.length = 0;
  for (let i = 1; i <= gridRow; i++) {
    for (let j = 1; j <= gridCol; j++) {
      const crossX = j * size;
      const crossY = i * size;
      drawCross(crossX, crossY, "grey");
      crossHist.push({ x: crossX, y: crossY });
    }
  }
}
