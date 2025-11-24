const download = document.getElementById("download");
const load = document.getElementById("load");
const fileInput = document.getElementById("fileInput");
const clear = document.getElementById("clearCanvas");

function toDownload() {
  const customName = prompt("請輸入檔名", "save_drawing.json");
  const stringData = JSON.stringify(shapeHist);
  if (customName === null) {
    return;
  }
  downloadFile(stringData, customName);
}
if (download) {
  download.addEventListener("click", toDownload);
}

function downloadFile(string, filename) {
  const blob = new Blob([string], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log(`已準備下載檔案: ${filename}`);
}

load.addEventListener("click", () => {
  fileInput.click();
});
fileInput.addEventListener("change", toLoad);

function toLoad(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    const fileString = e.target.result;
    try {
      const parsedData = JSON.parse(fileString);
      shapeHist = parsedData;
      redraw();
    } catch (error) {
      alert("error:無效檔案格式。");
    }
  };

  reader.onerror = function () {
    alert("error：檔案讀取失敗。");
  };

  reader.readAsText(file);

  event.target.value = "";
}

clear.addEventListener("click", clearCanvas);
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (gridSize > 0) {
    drawGrid(gridSize);
  }
  snapXY = null;
  shapeHist.length = 0;
  canvasHist.length = 0;
}
