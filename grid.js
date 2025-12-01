const grid = document.getElementById("checkbox1");
const snapGrid = document.getElementById("checkbox2");
grid.addEventListener("change", showGrid);
snapGrid.addEventListener("change", function () {
  snapMode = this.checked;
});

let gridHist = null;
let snapMode = false;
let gridSize = 0;

function showGrid() {
  if (grid.checked) {
    const gridWH = prompt("請輸入格子尺寸");
    gridSize = Number(gridWH);
    if (gridWH === null) {
      gridSize = null;
      grid.checked = false;
      return;
    }
    gridHist = gridSize;
    drawGrid(gridSize);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snapXY = null;
    gridSize = null;
    crossHist = [];
    redraw();
  }
}

let snapXY = null;

function findCross(mx, my) {
  if (!gridHist) {
    snapXY = null;
    redraw();
    return;
  }
  let snapX = Math.round(mx / gridSize) * gridSize;
  let snapY = Math.round(my / gridSize) * gridSize;
  if (!snapXY || snapXY.x !== snapX || snapXY.y !== snapY) {
    snapXY = { x: snapX, y: snapY };
    redraw();
  }
}
