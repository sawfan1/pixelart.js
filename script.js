console.log("app initialized!")

// -----------------------------------

function generateSquare(length, pos) {
  let res = [];
  for (let y = -length; y <= length; y++) {
    for (let x = -length; x <= length; x++) {
      const px = Math.floor(pos.x) + x;
      const py = Math.floor(pos.y) + y;
      if (px >= 0 && px < WIDTH && py >= 0 && py < HEIGHT) {
        res.push({ x: px, y: py });
      }
    }
  }
  return res;
}

function generateBrush(radius, pos) {
  let res = [];

  for (let y = -radius; y <= radius; y++) {
    for (let x = -radius; x <= radius; x++) {
      if (x * x + y * y <= radius * radius) {
        const px = Math.floor(pos.x) + x;
        const py = Math.floor(pos.y) + y;

        if (
          px >= 0 && px < WIDTH &&
          py >= 0 && py < HEIGHT
        ) {
          res.push({
              x: px,
              y: py
          });
        }
      }
    }
  }

  return res;
}


// -----------------------------------

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

let stroke = 3

function brush(event) {
  const pos = getMousePos(canvas, event);
  const pixels = generateBrush(4, pos)

  for (const pixel of pixels) {
    setPixel(40, 120, 120, Math.floor(pixel.x), Math.floor(pixel.y))
  }
  
  console.log(pos.x, pos.y)
  updateCanvas()
  console.log("brushing")
}

function erase(event) {
  const pos = getMousePos(canvas, event);
  const pixels = generateSquare(4, pos)
  for (const pixel of pixels) {
    setPixel(255, 255, 255, Math.floor(pixel.x), Math.floor(pixel.y))
  }

  updateCanvas()
}

canvas.addEventListener("mousemove", (event) => {
  if (!mouse_held) return;
  if (selected_tool == "select") {
    console.log("selecting")
  } 
  if (selected_tool == "brush") {
    brush(event)
  }
  if (selected_tool == "eraser") {
    erase(event)
    console.log("erasing")
  }
})

canvas.addEventListener("mouseup", (event) => {
  mouse_held = false;
})

