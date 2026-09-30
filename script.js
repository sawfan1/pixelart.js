console.log("hello world!")

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

const WIDTH = 600;
const HEIGHT = 400;

const tools = {
  SELECT: "select",
  BRUSH: "brush",
  SPRAY: "spray",
  PEN: "pen",
  ERASER: "eraser",
  CIRCLE: "circle",
  RECT: "rect",
  TRI: "tri"
}

let state = new Uint8ClampedArray(WIDTH * HEIGHT * 3).fill(255) // for rgb

const imageData = ctx.createImageData(WIDTH, HEIGHT)
const data = imageData.data;

function updateCanvas() {
  for (let i=0, j=0; i<state.length; i+=3, j+=4) {
    data[j] = state[i];
    data[j + 1] = state[i + 1];
    data[j + 2] = state[i + 2];
    data[j + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

updateCanvas()


const idx = (x, y) => (y*WIDTH+x)*3;
function setPixel(r, g, b, x, y) {
  let pos = idx(x, y);
  state[pos] = r;
  state[pos+1] = g;
  state[pos+2] = b;
}

let selected_tool = tools.SELECT;
$("#select").addClass("active")

// handle selections

for (const key in tools) {
  const toolValue = tools[key]
  const id = toolValue;

  $(`#${id}`).click(() => {
    $(`#${selected_tool}`).removeClass("active");
    selected_tool = toolValue;
    $(`#${id}`).addClass("active");
  });
}

function getMousePos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
  };
}

let mouse_held = false;

canvas.addEventListener("mousedown", () => {
  mouse_held = true;
})

function brush(event) {
  const pos = getMousePos(canvas, event);
  setPixel(0, 0, 0, Math.floor(pos.x), Math.floor(pos.y))
  console.log(pos.x, pos.y)
  updateCanvas()
  console.log("brushing")
}

canvas.addEventListener("mousemove", (event) => {
  if (!mouse_held) return;
  if (selected_tool == "select") {
    console.log("selecting")
  } else if (selected_tool == "brush") {
    brush(event)
  }
})

canvas.addEventListener("mouseup", (event) => {
  mouse_held = false;
})

