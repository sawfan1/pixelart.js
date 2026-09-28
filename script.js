console.log("hello world!")

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

const WIDTH = 600;
const HEIGHT = 400;



let state = new Uint8ClampedArray(WIDTH * HEIGHT * 4) // for rgb and shimmer

const idx = (x, y) => {(y*600+x)*4};
function setPixel(r, g, b, x, y, shimmer) {
  let pos = idx(x, y);
  state[pos] = r;
  state[pos+1] = g;
  state[pos+2] = b;
  state[pos+3] = shimmer;
}

