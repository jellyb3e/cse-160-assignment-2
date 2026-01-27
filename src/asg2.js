// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

let gl;
let canvas;
let a_Position;
let u_FragColor;
let u_Size;

var shapes_list = [];

// color sliders & side slider
let r, g, b, size_slider, seg_slider;
let type = 'point';
let showingInitials = false;

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  fetchDocumentElements();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = click;

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function click(ev) {
  if (ev.buttons != 1) return;

  [x,y] = convertCoordinatesEventToGL(ev);
  let color = [r.value/255, g.value/255, b.value/255, 1.0];
  let size = size_slider.value;
  let segments = seg_slider.value;

  let shape;
  switch(type) {
    case 'point':
      shape = new Point([x,y],size,color);
      break;
    case 'triangle':
      shape = new Triangle([x,y],size,color);
      break;
    case 'circle':
      shape = new Circle([x,y],size,color,segments);
      break;
    case 'brush':
      shape = new Brush([x,y],size,color,segments);
      break;
    default:
      console.log("what gong on");
      break;
  }
  shapes_list.push(shape);
  renderAllShapes();
}

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
} 

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  for(let shape of shapes_list) {
    shape.render();
  }
}

function clearScreen() {
  shapes_list = [];
  renderAllShapes();
}

function fetchDocumentElements() {
  r = document.getElementById("color-r");
  g = document.getElementById("color-g");
  b = document.getElementById("color-b");
  size_slider = document.getElementById("size");
  seg_slider = document.getElementById("segments");
  
  document.getElementById("clear-button").addEventListener("click", clearScreen);
  document.getElementById("point-button").addEventListener("click", () => { type = 'point' });
  document.getElementById("triangle-button").addEventListener("click", () => { type = 'triangle' });
  document.getElementById("circle-button").addEventListener("click", () => { type = 'circle' });
  document.getElementById("brush-button").addEventListener("click", () => { type = 'brush' });
  document.getElementById("draw-button").addEventListener("click", () => {
    shapes_list.push(new Squirrel(showingInitials));
    renderAllShapes();
  });
  document.getElementById("initials-on").addEventListener("click", () => {
    showingInitials = true;
  });
  document.getElementById("initials-off").addEventListener("click", () => {
    showingInitials = false;
  });
}