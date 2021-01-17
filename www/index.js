import { Universe, Cell } from "fraud-game-of-life"; // <<=== compiled from rust stuff
import { memory } from "fraud-game-of-life/fraud_game_of_life_bg";

let animationId = null;
const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
const universe = Universe.new(64, 64);
/// INPUT
const updateDimension = () => {
  try {
    const inputWidth = parseInt(document.getElementById("width").value);
    const inputHeight = parseInt(document.getElementById("height").value);

    if (inputWidth) {
      universe.set_width(inputWidth);
      canvas.width = (CELL_SIZE + 1) * universe.width() + 1;
    }
    if (inputHeight) {
      universe.set_height(inputHeight);
      canvas.height = (CELL_SIZE + 1) * universe.height() + 1;
    }
    universe.reset();
  } catch (e) {
    console.log(`error:${e}`);
  }
};
const updateTickIteration = () => {
  try {
    const tickIteration = parseInt(
      document.getElementById("tick-iteration").value
    );
    console.log(`tick:${tickIteration}`);
    if (tickIteration) {
      universe.tick_iteration(tickIteration);
    }
  } catch (e) {
    console.log(`error:${e}`);
  }
};
/// DRAWING
const canvas = document.getElementById("fraud-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * universe.height() + 1;
canvas.width = (CELL_SIZE + 1) * universe.width() + 1;
const ctx = canvas.getContext("2d");
const renderLoop = () => {
  universe.tick();
  drawGrid();
  drawCells();
  animationId = requestAnimationFrame(renderLoop);
};
const isPaused = () => animationId === null;
const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;
  // Vertical lines.
  for (let i = 0; i <= universe.width(); i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(
      i * (CELL_SIZE + 1) + 1,
      (CELL_SIZE + 1) * universe.height() + 1
    );
  }
  // Horizontal lines.
  for (let j = 0; j <= universe.height(); j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * universe.width() + 1, j * (CELL_SIZE + 1) + 1);
  }
  ctx.stroke();
};
const getIndex = (row, column) => {
  return row * universe.width() + column;
};
const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(
    memory.buffer,
    cellsPtr,
    universe.width() * universe.height()
  );
  ctx.beginPath();
  ctx.fillStyle = ALIVE_COLOR;
  for (let row = 0; row < universe.height(); row++) {
    for (let col = 0; col < universe.width(); col++) {
      const idx = getIndex(row, col);
      if (cells[idx] !== Cell.Alive) continue;
      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }
  ctx.fillStyle = DEAD_COLOR;
  for (let row = 0; row < universe.height(); row++) {
    for (let col = 0; col < universe.width(); col++) {
      const idx = getIndex(row, col);
      if (cells[idx] !== Cell.Dead) continue;
      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }
  ctx.stroke();
};
/// BUTTONS
const playPauseButton = document.getElementById("play-pause");
const play = () => {
  playPauseButton.textContent = "⏸";
  renderLoop();
};
const pause = () => {
  playPauseButton.textContent = "▶";
  cancelAnimationFrame(animationId);
  animationId = null;
};
playPauseButton.addEventListener("click", (event) => {
  if (isPaused()) {
    play();
  } else {
    pause();
  }
});
const updateDimensionButton = document.getElementById("update-dimension");
updateDimensionButton.addEventListener("click", (event) => {
  updateDimension();
});
const resetUniverseButton = document.getElementById("reset-universe");
resetUniverseButton.addEventListener("click", (event) => {
  universe.reset();
});
const updateTickIterationButton = document.getElementById(
  "update-tick-iteration"
);
updateTickIterationButton.addEventListener("click", (event) => {
  updateTickIteration();
});
canvas.addEventListener("click", (event) => {
  const boundingRect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;
  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;
  const row = Math.min(
    Math.floor(canvasTop / (CELL_SIZE + 1)),
    universe.height() - 1
  );
  const col = Math.min(
    Math.floor(canvasLeft / (CELL_SIZE + 1)),
    universe.width() - 1
  );
  universe.toggle_cell(row, col);
  drawGrid();
  drawCells();
});
// INIT
drawGrid();
play();
