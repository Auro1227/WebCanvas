const mouseBtn = document.getElementById("default-cursor");
const pencil = document.getElementById("pencil");
const eraser = document.getElementById("eraser");

let doodleMode = false;
let eraseMode = false;
let drawHist = {};
let pointHist = [];

mouseBtn.addEventListener("click", () => {
  doodleMode = false;
  eraseMode = false;
  lineTrack = false;
  lineSX = 0;
  lineSY = 0;
  rectTrack = false;
  circleTrack = false;
  solRectTrack = false;
  solCircleTrack = false;
  selectedBoxInd = null;
  redraw();
});

pencil.addEventListener("click", () => {
  doodleMode = true;
  eraseMode = false;
  canvas.addEventListener("mousedown", drawOErase);
});
eraser.addEventListener("click", () => {
  eraseMode = true;
  doodleMode = false;
  canvas.addEventListener("mousedown", drawOErase);
});

function drawOErase(mouse) {
  if (!doodleMode && !eraseMode) {
    return;
  }

  lineTrack = false;
  lineSX = 0;
  lineSY = 0;
  rectTrack = false;
  circleTrack = false;
  solRectTrack = false;
  solCircleTrack = false;

  const cvCoord = canvas.getBoundingClientRect();
  let x = mouse.clientX - cvCoord.left;
  let y = mouse.clientY - cvCoord.top;

  ctx.beginPath();
  ctx.moveTo(x, y);

  if (doodleMode) {
    ctx.strokeStyle = currColor;
    pointHist.push({ x: x, y: y });
    ctx.globalCompositeOperation = "source-over";
    canvas.addEventListener("mousemove", toDraw);
  } else if (eraseMode) {
    pointHist.push({ x: x, y: y });
    ctx.globalCompositeOperation = "destination-out";
    doodleMode = false;
    canvas.addEventListener("mousemove", toErase);
  }
  canvas.addEventListener("mouseup", stopDrawOErase);
  canvas.addEventListener("mouseleave", stopDrawOErase);
}

function toDraw(mouse) {
  const cvCoord = canvas.getBoundingClientRect();
  let x = mouse.clientX - cvCoord.left;
  let y = mouse.clientY - cvCoord.top;
  ctx.strokeStyle = currColor;
  ctx.lineWidth = currSize;
  ctx.lineTo(x, y);
  ctx.stroke();
  pointHist.push({ x: x, y: y });
}

function toErase(mouse) {
  const cvCoord = canvas.getBoundingClientRect();
  let x = mouse.clientX - cvCoord.left;
  let y = mouse.clientY - cvCoord.top;
  ctx.lineWidth = currSize;
  ctx.lineTo(x, y);
  ctx.stroke();
  pointHist.push({ x: x, y: y });
}

function stopDrawOErase() {
  ctx.closePath();
  const savedPts = [...pointHist];
  if (doodleMode) {
    shapeHist.push({
      shape: "pencil",
      points: savedPts,
      color: currColor,
      bs: currSize,
    });
  }
  if (eraseMode) {
    shapeHist.push({
      shape: "eraser",
      points: savedPts,
      bs: currSize,
    });
  }
  pointHist.length = 0;
  canvas.removeEventListener("mousemove", toDraw);
  canvas.removeEventListener("mousemove", toErase);
  canvas.removeEventListener("mouseup", stopDrawOErase);
  canvas.removeEventListener("mouseleave", stopDrawOErase);

  ctx.globalCompositeOperation = "source-over";
}

slider.addEventListner("input", () => {
  const value = slider.value;
  sliderValue.textContent = value;
  sliderContainer.style.setProperty("--progress", "${value}%");
  sliderValue.style.left = "${value}%";
});
