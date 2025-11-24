const undo = document.getElementById("undo");
const redo = document.getElementById("redo");

undo.addEventListener("click", toUndo);
redo.addEventListener("click", toRedo);
let redoList = [];

function toUndo() {
  if (canvasHist.length <= 1) return;
  copyNPaste(canvasHist[canvasHist.length - 1], redoList);
  canvasHist.pop();
  shapeHist.length = 0;
  shapeHist.push(
    ...JSON.parse(JSON.stringify(canvasHist[canvasHist.length - 1]))
  );
  selectedBoxInd = null;
  redraw();
}

function toRedo() {
  if (redoList.length === 0) return;
  shapeHist.length = 0;
  shapeHist.push(
    ...JSON.parse(JSON.stringify(canvasHist[canvasHist.length - 1]))
  );
  selectedBoxInd = null;
  redraw();
  copyNPaste(redoList[redoList.length - 1], canvasHist);
  redoList.pop();
}

document.addEventListener("keydown", toDelete);

function toDelete(event) {
  if (event.key === "Delete" && selectedBoxInd !== null) {
    shapeHist.splice(selectedBoxInd, 1);
    selectedBoxInd = null;
    selectedShape = null;
    redraw();
    copyNPaste(shapeHist, canvasHist);
  }
}
