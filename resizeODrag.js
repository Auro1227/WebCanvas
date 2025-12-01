canvas.addEventListener("click", selectedBox);
canvas.addEventListener("mousedown", preDrag);
canvas.addEventListener("mousemove", resizeODrag);
canvas.addEventListener("mouseup", postDragMove);

let dragCorner = null;
let dragMode = false;
let hoverShapeInd = null;
let selectedBoxInd = null;
let selectedShape = null;
let resizingShape = null;
let moveMode = false;

function cursorStyle(type) {
  if (type === "tl" || type === "dr") {
    return "nwse-resize";
  } else if (type === "tr" || type === "dl") {
    return "nesw-resize";
  }
  return "crosshair";
}

function resizeODrag(mouse) {
  if (dragMode) return; //如果已經在拖曳就不要偵測mousemove了
  const cvCoord = canvas.getBoundingClientRect();
  let x = mouse.clientX - cvCoord.left;
  let y = mouse.clientY - cvCoord.top;
  let foundCorner = null;
  let foundShapeInd = null;

  //有框時鼠標是否在點上 有就記起來
  if (selectedBoxInd !== null) {
    for (let i = 0; i < rectHist.length; i++) {
      if (inRect(rectHist[i], x, y)) {
        foundCorner = rectHist[i].type;
        break;
      }
    }
  }
  //如果有找到 就是要拖曳的點 如果也同時hover就清掉不要讓他變綠色
  if (foundCorner) {
    dragCorner = foundCorner;
    canvas.style.cursor = cursorStyle(foundCorner);
    if (hoverShapeInd !== null) {
      hoverShapeInd = null;
      redraw();
    }
    return;
  } else {
    dragCorner = null;
  }

  for (let i = shapeHist.length - 1; i >= 0; i--) {
    if (shapeHist[i].shape === "pencil" || shapeHist[i].shape === "eraser") {
      continue;
    }
    if (inShape(shapeHist[i], x, y)) {
      foundShapeInd = i;
      break;
    }
  }
  if (foundShapeInd !== hoverShapeInd) {
    hoverShapeInd = foundShapeInd;
    redraw();
  }

  if (dragCorner) {
    canvas.style.cursor = cursorStyle(dragCorner);
  } else {
    canvas.style.cursor = "crosshair";
  }
  if (
    snapMode &&
    grid &&
    grid.checked &&
    (lineTrack || rectTrack || circleTrack || solRectTrack || solCircleTrack)
  ) {
    findCross(x, y);
  }
}

function inRect(histInd, x, y) {
  if (
    x >= histInd.x &&
    x <= histInd.x + histInd.w &&
    y >= histInd.y &&
    y <= histInd.y + histInd.h
  ) {
    return true;
  }

  return false;
}

function inShape(histInd, x, y) {
  if (histInd.shape === "line") {
    const x1 = histInd.sx;
    const y1 = histInd.sy;
    const x2 = histInd.ex;
    const y2 = histInd.ey;
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= 6) return true;
  }
  if (histInd.shape === "circle") {
    let a = x - histInd.x;
    let b = y - histInd.y;
    let dist = a ** 2 + b ** 2;
    if (dist <= histInd.r ** 2) {
      return true;
    }
  }
  if (histInd.shape === "rect") {
    if (
      x >= histInd.x &&
      x <= histInd.x + histInd.w &&
      y >= histInd.y &&
      y <= histInd.y + histInd.h
    ) {
      return true;
    }
  }
  return false;
}

function selectedBox() {
  if (hoverShapeInd === null) return;
  selectedBoxInd = hoverShapeInd;
  selectedShape = shapeHist[selectedBoxInd];
  redraw();
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (gridSize > 0) {
    drawGrid(gridSize);
  }
  rectHist = [];
  for (let i = 0; i < shapeHist.length; i++) {
    let color = shapeHist[i].color;
    if (shapeHist[i] === shapeHist[hoverShapeInd]) {
      color = "black";
    }
    if (shapeHist[i].shape === "line") {
      drawLine(
        shapeHist[i].sx,
        shapeHist[i].sy,
        shapeHist[i].ex,
        shapeHist[i].ey,
        color,
        shapeHist[i].bs
      );
    } else if (shapeHist[i].shape === "circle" && shapeHist[i].ff === false) {
      drawCircle(
        shapeHist[i].x,
        shapeHist[i].y,
        shapeHist[i].r,
        color,
        shapeHist[i].bs
      );
    } else if (shapeHist[i].shape === "rect" && shapeHist[i].ff === false) {
      drawRect(
        shapeHist[i].x,
        shapeHist[i].y,
        shapeHist[i].w,
        shapeHist[i].h,
        color,
        shapeHist[i].bs
      );
    } else if (shapeHist[i].shape === "rect" && shapeHist[i].ff === true) {
      drawSolRect(
        shapeHist[i].x,
        shapeHist[i].y,
        shapeHist[i].w,
        shapeHist[i].h,
        color,
        shapeHist[i].bs
      );
    } else if (shapeHist[i].shape === "circle" && shapeHist[i].ff === true) {
      drawSolCircle(
        shapeHist[i].x,
        shapeHist[i].y,
        shapeHist[i].r,
        color,
        shapeHist[i].bs
      );
    } else if (
      shapeHist[i].shape === "pencil" ||
      shapeHist[i].shape === "eraser"
    ) {
      if (shapeHist[i].shape === "pencil") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = shapeHist[i].color;
      } else if (shapeHist[i].shape === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
      }
      const pts = shapeHist[i].points;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let j = 1; j < pts.length; j++) {
        ctx.lineTo(pts[j].x, pts[j].y);
      }
      ctx.lineWidth = shapeHist[i].bs;
      ctx.stroke();
      ctx.closePath();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  if (selectedBoxInd !== null) {
    const selectedShape = shapeHist[selectedBoxInd];
    if (selectedShape.shape === "line") {
      lineSelect(
        selectedShape.sx,
        selectedShape.sy,
        selectedShape.ex,
        selectedShape.ey
      );
    } else if (selectedShape.shape === "rect") {
      dottedRect(
        selectedShape.x - 5,
        selectedShape.y - 5,
        selectedShape.w + 10,
        selectedShape.h + 10,
        "grey"
      );
    } else if (selectedShape.shape === "circle") {
      dottedRect(
        selectedShape.x - selectedShape.r - 2,
        selectedShape.y - selectedShape.r - 2,
        selectedShape.r * 2 + 3,
        selectedShape.r * 2 + 3,
        "grey"
      );
    }
  }
  if (snapXY) {
    drawCross(snapXY.x, snapXY.y, "red");
  }
}

let currX = 0;
let currY = 0;
function preDrag(mouse) {
  const cvCoord = canvas.getBoundingClientRect();
  let x = mouse.clientX - cvCoord.left;
  let y = mouse.clientY - cvCoord.top;
  if (dragCorner && selectedBoxInd !== null) {
    dragMode = true;
    resizingShape = shapeHist[selectedBoxInd];
    if (resizingShape && dragCorner === "tl") {
      drX = resizingShape.x + resizingShape.r;
      drY = resizingShape.y + resizingShape.r;
    }
    if (resizingShape && dragCorner === "tr") {
      dlX = resizingShape.x - resizingShape.r;
      dlY = resizingShape.y + resizingShape.r;
    }
    if (resizingShape && dragCorner === "dl") {
      trX = resizingShape.x + resizingShape.r;
      trY = resizingShape.y - resizingShape.r;
    }
    if (resizingShape && dragCorner === "dr") {
      tlX = resizingShape.x - resizingShape.r;
      tlY = resizingShape.y - resizingShape.r;
    }
    canvas.addEventListener("mousemove", resize);
  }
  if (selectedBoxInd !== null && inShape(shapeHist[selectedBoxInd], x, y)) {
    moveMode = true;
    canvas.style.cursor = "move";
    canvas.addEventListener("mousemove", move);
    currX = x;
    currY = y;
  }
}

let drX = 0;
let drY = 0;
let dlX = 0;
let dlY = 0;
let tlX = 0;
let tlY = 0;
let trX = 0;
let trY = 0;
function resize(mouse) {
  if (!resizingShape) return;
  const cvCoord = canvas.getBoundingClientRect();
  let mouseX = mouse.clientX - cvCoord.left;
  let mouseY = mouse.clientY - cvCoord.top;

  if (resizingShape.shape === "line") {
    if (dragCorner === "tl") {
      resizingShape.sx = mouseX;
      resizingShape.sy = mouseY;
    } else if (dragCorner === "tr") {
      resizingShape.ex = mouseX;
      resizingShape.ey = mouseY;
    }
    redraw();
    return;
  }
  if (resizingShape.shape === "rect") {
    if (dragCorner === "tl") {
      resizingShape.w = resizingShape.w + (resizingShape.x - mouseX);
      resizingShape.h = resizingShape.h + (resizingShape.y - mouseY);
      resizingShape.x = mouseX;
      resizingShape.y = mouseY;
    } else if (dragCorner === "tr") {
      let dlY = resizingShape.y + resizingShape.h;
      resizingShape.w = mouseX - resizingShape.x;
      resizingShape.y = mouseY;
      resizingShape.h = dlY - resizingShape.y;
    } else if (dragCorner === "dl") {
      let trX = resizingShape.x + resizingShape.w;
      resizingShape.x = mouseX;
      resizingShape.w = trX - resizingShape.x;
      resizingShape.h = mouseY - resizingShape.y;
    } else if (dragCorner === "dr") {
      resizingShape.w = mouseX - resizingShape.x;
      resizingShape.h = mouseY - resizingShape.y;
    }
    redraw();
    return;
  }
  if (resizingShape.shape === "circle") {
    if (dragCorner === "tl") {
      resizingShape.x = (mouseX + drX) / 2;
      resizingShape.y = (mouseY + drY) / 2;
      let distX = resizingShape.x - mouseX;
      resizingShape.r = distX;
    }
    if (dragCorner === "tr") {
      resizingShape.x = (mouseX + dlX) / 2;
      resizingShape.y = (mouseY + dlY) / 2;
      let distX = mouseX - resizingShape.x;
      resizingShape.r = distX;
    }
    if (dragCorner === "dl") {
      resizingShape.x = (mouseX + trX) / 2;
      resizingShape.y = (mouseY + trY) / 2;
      let distX = resizingShape.x - mouseX;
      resizingShape.r = distX;
    }
    if (dragCorner === "dr") {
      resizingShape.x = (mouseX + tlX) / 2;
      resizingShape.y = (mouseY + tlY) / 2;
      let distX = mouseX - resizingShape.x;
      resizingShape.r = distX;
    }
    redraw();
    return;
  }
}

let saveShape = false;
function postDragMove() {
  if (dragMode) {
    dragMode = false;
    dragCorner = null;
    resizingShape = null;
    canvas.removeEventListener("mousemove", resize);
    copyNPaste(shapeHist, canvasHist);
    saveShape = true;
  }
  if (moveMode) {
    moveMode = false;
    canvas.removeEventListener("mousemove", move);
    canvas.style.cursor = "default";
    saveShape = true;
  }
  if (saveShape) {
    copyNPaste(shapeHist, canvasHist);
    redoList.length = 0;
  }
}

function move(mouse) {
  const cvCoord = canvas.getBoundingClientRect();
  let x = mouse.clientX - cvCoord.left;
  let y = mouse.clientY - cvCoord.top;
  if (!moveMode) return;
  if (!selectedShape) return;
  canvas.style.cursor = "move";
  if (selectedShape.shape === "line") {
    let distX = x - currX;
    let distY = y - currY;
    selectedShape.sx += distX;
    selectedShape.sy += distY;
    selectedShape.ex += distX;
    selectedShape.ey += distY;
  }
  if (selectedShape.shape === "rect") {
    let distX = x - currX;
    let distY = y - currY;
    selectedShape.x += distX;
    selectedShape.y += distY;
  }
  if (selectedShape.shape === "circle") {
    let distX = x - currX;
    let distY = y - currY;
    selectedShape.x += distX;
    selectedShape.y += distY;
  }
  currX = x;
  currY = y;
  redraw();
}
