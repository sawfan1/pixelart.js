console.log("app initialized!")

const SELECTED_COLOR = { r: 145, g: 23, b: 90 }
let SELECTED_STROKE = 4

const WHITE = {
  r: 255,
  g: 255,
  b: 255
}

function drawLine(from, to, stamp_function) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy)

  const step = Math.max(1, Math.floor(SELECTED_STROKE/2));
  const steps = Math.max(1, Math.ceil(dist/step));

  for (let i=1; i<=steps; i++) {
    const t = i / steps;
    const x = from.x + dx * t;
    const y = from.y + dy * t;
    stamp_function(x, y);
  }
}

function stamp_brush(x, y) {
  const pixels = generateBrush(SELECTED_STROKE, {x,y});
  for (const pixel of pixels) {
    setPixel(SELECTED_COLOR, pixel.x, pixel.y);
  }
}

function stamp_spray(x, y) {
  const pixels = generateSpray(SELECTED_STROKE, {x, y})
  for (const pixel of pixels) {
    setPixel(SELECTED_COLOR, pixel.x, pixel.y)
  }
}

function stamp_eraser(x, y) {
  const pixels = generateSquare(SELECTED_STROKE, { x, y });
  const white = { r: 255, g: 255, b: 255 };
  for (const pixel of pixels) {
    setPixel(WHITE, pixel.x, pixel.y);
  }
}

function stamp_pen(x, y) {
  const pixels = generateBrush(1, {x, y})
  for (const pixel of pixels) {
    setPixel(SELECTED_COLOR, pixel.x, pixel.y)
  }
}

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

function generateSpray(radius, pos) {
  const res = generateBrush(radius * 2, pos);
  const keepRatio = 0.1;

  return res.filter(() => Math.random() < keepRatio);
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
const preview = document.getElementById("preview")
const preview_ctx = preview.getContext('2d')

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
  for (let i = 0, j = 0; i < state.length; i += 3, j += 4) {
    data[j] = state[i];
    data[j + 1] = state[i + 1];
    data[j + 2] = state[i + 2];
    data[j + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

updateCanvas()

const idx = (x, y) => (y * WIDTH + x) * 3;

function setPixel(color, x, y) {
  let pos = idx(x, y);
  state[pos] = color.r;
  state[pos + 1] = color.g;
  state[pos + 2] = color.b;
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
    if (selected_tool == "brush" || selected_tool == "spray") {
      $("#decal").css("border-radius", "50%")
    } else {
      $("#decal").css("border-radius", "0")
    }

    if (selected_tool == "select" || selected_tool == "pen" || selected_tool == "circle" || selected_tool == "rect" || selected_tool == "tri") {
      $("#decal").hide()
    } else {
      $("#decal").show()
    }
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

canvas.addEventListener("mousedown", (event) => {
  mouse_held = true;
  lastpos = null;
  shape_start = selected_tool === "rect" ? getMousePos(canvas, event) : null;
})

let stroke = 3
let lastpos = null
let shape_start = null


canvas.addEventListener("mousemove", (event) => {
  const pos = getMousePos(canvas, event);
  $("#decal").css({ left: `${event.clientX}px`, top: `${event.clientY}px`})

  if (!mouse_held) return;

  if (selected_tool == "select") {
    console.log("selecting")
    console.log(pos)
  }
  if (selected_tool == "brush") {
    if (lastpos) {
      drawLine(lastpos, pos, stamp_brush)
    } else {
      stamp_brush(pos.x, pos.y)
    }

    lastpos = pos;
    updateCanvas()
  }
  if (selected_tool === "eraser") {
    if (lastpos) {
      drawLine(lastpos, pos, stamp_eraser);
    } else {
      stamp_eraser(pos.x, pos.y);
    }
    lastpos = pos;
    updateCanvas();
  }

  if (selected_tool === "pen") {
    if (lastpos) {
      drawLine(lastpos, pos, stamp_pen)
    } else {
      stamp_pen(pos.x, pos.y);
    }

    lastpos = pos;
    updateCanvas()
  }

  if (selected_tool === "spray") {
    if (lastpos) {
      drawLine(lastpos, pos, stamp_spray)
    } else {
      stamp_spray(pos.x, pos.y);
    }

    lastpos = pos;
    updateCanvas()
  }

  if (selected_tool == "rect") {
    preview_ctx.clearRect(0, 0, WIDTH, HEIGHT)
    preview_ctx.beginPath()
    preview_ctx.rect(shape_start.x, shape_start.y, pos.x - shape_start.x, pos.y - shape_start.y)
    preview_ctx.strokeStyle = `rgb(${SELECTED_COLOR.r}, ${SELECTED_COLOR.g}, ${SELECTED_COLOR.b})`
    preview_ctx.lineWidth = SELECTED_STROKE
    preview_ctx.stroke()
  }
})

canvas.addEventListener("mouseup", (event) => {
  mouse_held = false;
  if (selected_tool === "rect" && shape_start) {
    const preview_data = preview_ctx.getImageData(0, 0, WIDTH, HEIGHT).data
    for (let pixel = 0; pixel < WIDTH * HEIGHT; pixel++) {
      const preview_offset = pixel * 4
      const alpha = preview_data[preview_offset + 3] / 255
      if (alpha === 0) continue

      const state_offset = pixel * 3
      state[state_offset] = Math.round(preview_data[preview_offset] * alpha + state[state_offset] * (1 - alpha))
      state[state_offset + 1] = Math.round(preview_data[preview_offset + 1] * alpha + state[state_offset + 1] * (1 - alpha))
      state[state_offset + 2] = Math.round(preview_data[preview_offset + 2] * alpha + state[state_offset + 2] * (1 - alpha))
    }
    updateCanvas()
    preview_ctx.clearRect(0, 0, WIDTH, HEIGHT)
    shape_start = null
  }
})

$('#color').on('input', function () {
  const selectedColor = $(this).val();
  const cur_color = hexToRgb(selectedColor);
  SELECTED_COLOR.r = cur_color.r
  SELECTED_COLOR.g = cur_color.g
  SELECTED_COLOR.b = cur_color.b  
});

$('#stroke').on('input', function () {
  SELECTED_STROKE = $(this).val();
  // console.log(SELECTED_STROKE)
  $("#decal").css("width", `${SELECTED_STROKE*2}px`)
  $("#decal").css("height", `${SELECTED_STROKE*2}px`)
  console.log('set decal wh')
});

// initial settings

$("#decal").css("width", `${SELECTED_STROKE*2}px`)
$("#decal").css("height", `${SELECTED_STROKE*2}px`)

$("#decal").hide()
