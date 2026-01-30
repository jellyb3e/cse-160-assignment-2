// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let startTime, duration;

const g_shapes_list = [];
const g_vertices = [];
let g_globalAngle = 0;
let g_animate = true;
let g_animReset = false;
let g_startTime = performance.now()/1000.0;
let g_seconds = 0;
let g_currAnim = "walk";
const g_zoom = .3;
const g_rotMat = new Matrix4();
const cube = new Cube();
const m_body = new Matrix4();
const m_parent = new Matrix4();
let vertexBuffer;

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.55, 0.67, 0.71, 1.0);

  g_rotMat.setRotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,g_rotMat.elements);

  renderAllShapes();

  //loadShapes();
  //render();

  // SHITE
  //requestAnimationFrame(tick);
}

/*
function click(ev) {
  if (ev.buttons != 1) return;

  [x,y] = convertCoordinatesEventToGL(ev);

  g_shapes_list.push(shape);
  renderAllShapes();
}
*/
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
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

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  const identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix,false,identityM.elements);
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function addActionsForHtmlUI() {
  const angRange = document.getElementById('angle-range');
  const legB_j1Range = document.getElementById('legB_j1-range');
  const legB_j2Range = document.getElementById('legB_j2-range');

  angRange.addEventListener('mousemove', (ev) => {
    if (ev.buttons != 1) return;
    g_globalAngle = angRange.value;
    g_rotMat.setRotate(g_globalAngle,0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,g_rotMat.elements);
    renderAllShapes();
  });

  legB_j1Range.addEventListener('mousemove', (ev) => {
    if (ev.button != 1) return;
    angles.legBL_j1 = -legB_j1Range.value;
    renderAllShapes();
  });

  legB_j2Range.addEventListener('mousemove', (ev) => {
    if (ev.button != 1) return;
    angles.legBL_j2 = -legB_j2Range.value;
    renderAllShapes();
  });

  document.getElementById("anim-on").onclick = () => {g_animate = true; g_animReset = false;};
  document.getElementById("anim-off").onclick = () => {g_animate = false};
}

function renderAllShapes() {
  // Clear <canvas>
  startTime = performance.now();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //#region BODY
  cube.color = [1.0,1.0,1.0,1.0];
  cube.matrix.translate(0,.5,0);
  cube.matrix.rotate(angles.body,0,0,1);
  cube.matrix.scale(g_zoom,g_zoom,g_zoom);
  m_body.set(cube.matrix);
  cube.matrix.scale(1.0,.75,.75);
  cube.render();
  /**/
  //#endregion

  //#region BACK LEFT LEG
  // bl leg segment 1
  let length = 1.6/3;
  cube.color = [1,1,1,1];
  cube.matrix.set(m_body);
  cube.matrix.translate(.4,-.65,-.2);
  cube.matrix.rotate(-30 + angles.legBL_j1,0,0,1);
  m_parent.set(cube.matrix);
  cube.matrix.scale(.2,length,.15);
  cube.render();

  // bl leg segment 2
  cube.color = [0,0,0,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(70 + angles.legBL_j2,0,0,1);
  m_parent.set(cube.matrix);
  length = .9;
  cube.matrix.scale(.15,length,.15);
  cube.render();

  // bl leg segment 3
  cube.color = [0,0,0,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(-45 + angles.legBL_j3,0,0,1);
  m_parent.set(cube.matrix);
  length = 2.15;
  cube.matrix.scale(.15,length,.15);
  cube.render();

  // bl leg segment 4 (hoof)
  cube.color = [0,0,0,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(-45 + angles.legBL_j4,0,0,1);
  length = 2.15;
  cube.matrix.scale(.15,length,.15);
  cube.render();

  /**/
  //#endregion
  
  //#region BACK RIGHT LEG
  // br leg segment 1
  length = 1.6/3;
  cube.color = [1,1,1,1];
  cube.matrix.set(m_body);
  cube.matrix.translate(.4,-.65,.2);
  cube.matrix.rotate(-30 + angles.legBR_j1,0,0,1);
  m_parent.set(cube.matrix);
  cube.matrix.scale(.2,length,.15);
  cube.render();

  // br leg segment 2
  cube.color = [.3,.3,.3,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(70 + angles.legBR_j2,0,0,1);
  m_parent.set(cube.matrix);
  length = .9;
  cube.matrix.scale(.15,length,.15);
  cube.render();

  // br leg segment 3
  cube.color = [.3,.3,.3,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(-45 + angles.legBR_j3,0,0,1);
  length = 2.15;
  cube.matrix.scale(.15,length,.15);
  cube.render();
  //#endregion
  
  //#region FRONT LEFT LEG
  // fl leg segment 1
  length = .4;
  cube.color = [1,1,1,1];
  cube.matrix.set(m_body);
  cube.matrix.translate(-.4,-.65,-.2);
  cube.matrix.rotate(40 + angles.legFL_j1,0,0,1);
  m_parent.set(cube.matrix);
  cube.matrix.scale(.2,length,.15);
  cube.render();

  // fl leg segment 2
  cube.color = [0,0,0,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(-55 + angles.legFL_j2,0,0,1);
  m_parent.set(cube.matrix);
  length = 1.35;
  cube.matrix.scale(.15,length,.15);
  cube.render();

  // fl leg segment 3
  cube.color = [0,0,0,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(15 + angles.legFL_j3,0,0,1);
  length = 1.7;
  cube.matrix.scale(.15,length,.15);
  cube.render();
  //#endregion

  //#region FRONT RIGHT LEG
  // fr leg segment 1
  length = .4;
  cube.color = [1,1,1,1];
  cube.matrix.set(m_body);
  cube.matrix.translate(-.4,-.65,.2);
  cube.matrix.rotate(40 + angles.legFR_j1,0,0,1);
  m_parent.set(cube.matrix);
  cube.matrix.scale(.2,length,.15);
  cube.render();

  // fr leg segment 2
  cube.color = [.3,.3,.3,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(-55 + angles.legFR_j2,0,0,1);
  m_parent.set(cube.matrix);
  length = 1.35;
  cube.matrix.scale(.15,length,.15);
  cube.render();

  // fr leg segment 3
  cube.color = [.3,.3,.3,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(15 + angles.legFR_j3,0,0,1);
  length = 1.7;
  cube.matrix.scale(.15,length,.15);
  cube.render();
  /**/
  //#endregion

  //#region NECK
  cube.bottomW = .5;
  cube.color = [1.0,1.0,1.0,1.0];
  cube.matrix.set(m_body);
  cube.matrix.translate(-.3,-.2,0);
  cube.matrix.rotate(-145+angles.neck,0,0,1);
  m_parent.set(cube.matrix);
  length = .45
  cube.matrix.scale(length,length,length);
  cube.render();
  cube.bottomW = 1;
  //#endregion

  //#region HEAD
  cube.bottomW = .9;
  cube.color = [0.0,0.0,0.0,1.0];
  cube.matrix.set(m_parent);
  cube.matrix.translate(-.1,-length,0);
  cube.matrix.rotate(75+angles.head,0,0,1);
  m_parent.set(cube.matrix);
  cube.matrix.scale(.3,.5,.3);
  cube.render();
  cube.bottomW = 1;
  //#endregion

  //#region EARS
  cube.bottomW = .5;
  cube.color = [1.0,1.0,1.0,1.0];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,0,-.15);
  cube.matrix.rotate(-140+angles.ear,-120,30,1);
  length = .25;
  cube.matrix.scale(.2,length,.2);
  cube.render();

  cube.matrix.set(m_parent);
  cube.matrix.translate(0,0,.15);
  cube.matrix.rotate(-140+angles.ear,120,-30,1);
  cube.matrix.scale(.2,length,.2);
  cube.render();
  cube.bottomW = 1;
  
  //#endregion

  //#region TAIL
  cube.bottomW = .8;
  cube.color = [1.0,1.0,1.0,1.0];
  cube.matrix.set(m_body);
  cube.matrix.translate(.4,-.1,0);
  cube.matrix.rotate(45+angles.tail,0,0,1);
  length = .35;
  cube.matrix.scale(.2,length,.2);
  cube.render();
  cube.bottomW = 1;

  //#endregion
  
  cube.matrix.setIdentity();

  duration = performance.now() - startTime;
  sendTextToHTML("ms: " + duration.toFixed(1) + " fps: " + Math.floor(1000/duration),"perf-stats");
}

function loadShapes() {
  startTime = performance.now();
  // create buffer object
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(g_vertices), gl.STATIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  //#region SHAPES
  //#region BODY
  cube.color = [1.0,1.0,1.0,1.0];
  cube.matrix.translate(0,.5,0);
  cube.matrix.rotate(angles.body,0,0,1);
  cube.matrix.scale(g_zoom,g_zoom,g_zoom);
  m_body.set(cube.matrix);
  cube.matrix.scale(1.0,.75,.75);
  cube.render();
  /**/
  //#endregion

  //#region BACK LEFT LEG
  // bl leg segment 1
  let length = 1.6/3;
  cube.color = [1,1,1,1];
  cube.matrix.set(m_body);
  cube.matrix.translate(.4,-.65,-.2);
  cube.matrix.rotate(-30 + angles.legBL_j1,0,0,1);
  m_parent.set(cube.matrix);
  cube.matrix.scale(.2,length,.15);
  cube.render();

  // bl leg segment 2
  cube.color = [0,0,0,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(70 + angles.legBL_j2,0,0,1);
  m_parent.set(cube.matrix);
  length = .9;
  cube.matrix.scale(.15,length,.15);
  cube.render();

  // bl leg segment 3
  cube.color = [0,0,0,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(-45 + angles.legBL_j3,0,0,1);
  m_parent.set(cube.matrix);
  length = 2.15;
  cube.matrix.scale(.15,length,.15);
  cube.render();

  // bl leg segment 4 (hoof)
  cube.color = [0,0,0,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(-45 + angles.legBL_j4,0,0,1);
  length = 2.15;
  cube.matrix.scale(.15,length,.15);
  cube.render();

  /**/
  //#endregion
  
  //#region BACK RIGHT LEG
  // br leg segment 1
  length = 1.6/3;
  cube.color = [1,1,1,1];
  cube.matrix.set(m_body);
  cube.matrix.translate(.4,-.65,.2);
  cube.matrix.rotate(-30 + angles.legBR_j1,0,0,1);
  m_parent.set(cube.matrix);
  cube.matrix.scale(.2,length,.15);
  cube.render();

  // br leg segment 2
  cube.color = [.3,.3,.3,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(70 + angles.legBR_j2,0,0,1);
  m_parent.set(cube.matrix);
  length = .9;
  cube.matrix.scale(.15,length,.15);
  cube.render();

  // br leg segment 3
  cube.color = [.3,.3,.3,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(-45 + angles.legBR_j3,0,0,1);
  length = 2.15;
  cube.matrix.scale(.15,length,.15);
  cube.render();
  //#endregion
  
  //#region FRONT LEFT LEG
  // fl leg segment 1
  length = .4;
  cube.color = [1,1,1,1];
  cube.matrix.set(m_body);
  cube.matrix.translate(-.4,-.65,-.2);
  cube.matrix.rotate(40 + angles.legFL_j1,0,0,1);
  m_parent.set(cube.matrix);
  cube.matrix.scale(.2,length,.15);
  cube.render();

  // fl leg segment 2
  cube.color = [0,0,0,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(-55 + angles.legFL_j2,0,0,1);
  m_parent.set(cube.matrix);
  length = 1.35;
  cube.matrix.scale(.15,length,.15);
  cube.render();

  // fl leg segment 3
  cube.color = [0,0,0,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(15 + angles.legFL_j3,0,0,1);
  length = 1.7;
  cube.matrix.scale(.15,length,.15);
  cube.render();
  //#endregion

  //#region FRONT RIGHT LEG
  // fr leg segment 1
  length = .4;
  cube.color = [1,1,1,1];
  cube.matrix.set(m_body);
  cube.matrix.translate(-.4,-.65,.2);
  cube.matrix.rotate(40 + angles.legFR_j1,0,0,1);
  m_parent.set(cube.matrix);
  cube.matrix.scale(.2,length,.15);
  cube.render();

  // fr leg segment 2
  cube.color = [.3,.3,.3,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(-55 + angles.legFR_j2,0,0,1);
  m_parent.set(cube.matrix);
  length = 1.35;
  cube.matrix.scale(.15,length,.15);
  cube.render();

  // fr leg segment 3
  cube.color = [.3,.3,.3,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(15 + angles.legFR_j3,0,0,1);
  length = 1.7;
  cube.matrix.scale(.15,length,.15);
  cube.render();
  /**/
  //#endregion

  //#region NECK
  cube.bottomW = .5;
  cube.color = [1.0,1.0,1.0,1.0];
  cube.matrix.set(m_body);
  cube.matrix.translate(-.3,-.2,0);
  cube.matrix.rotate(-145+angles.neck,0,0,1);
  m_parent.set(cube.matrix);
  length = .45
  cube.matrix.scale(length,length,length);
  cube.render();
  cube.bottomW = 1;
  //#endregion

  //#region HEAD
  cube.bottomW = .9;
  cube.color = [0.0,0.0,0.0,1.0];
  cube.matrix.set(m_parent);
  cube.matrix.translate(-.1,-length,0);
  cube.matrix.rotate(75+angles.head,0,0,1);
  m_parent.set(cube.matrix);
  cube.matrix.scale(.3,.5,.3);
  cube.render();
  cube.bottomW = 1;
  //#endregion

  //#region EARS
  cube.bottomW = .5;
  cube.color = [1.0,1.0,1.0,1.0];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,0,-.15);
  cube.matrix.rotate(-140+angles.ear,-120,30,1);
  length = .25;
  cube.matrix.scale(.2,length,.2);
  cube.render();

  cube.matrix.set(m_parent);
  cube.matrix.translate(0,0,.15);
  cube.matrix.rotate(-140+angles.ear,120,-30,1);
  cube.matrix.scale(.2,length,.2);
  cube.render();
  cube.bottomW = 1;
  
  //#endregion

  //#region TAIL
  cube.bottomW = .8;
  cube.color = [1.0,1.0,1.0,1.0];
  cube.matrix.set(m_body);
  cube.matrix.translate(.4,-.1,0);
  cube.matrix.rotate(45+angles.tail,0,0,1);
  length = .35;
  cube.matrix.scale(.2,length,.2);
  cube.render();

  //#endregion
  //#endregion

  //gl.drawArrays(gl.TRIANGLES,0,g_vertices.length);
  console.log("All shapes rendered. vertices: " + g_vertices.length);
  duration = performance.now() - startTime;
  sendTextToHTML("ms: " + duration.toFixed(1) + " fps: " + Math.floor(1000/duration),"perf-stats");
}

function render() {
  startTime = performance.now();
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  g_rotMat.setRotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,g_rotMat.elements);
  
  gl.drawArrays(gl.TRIANGLES,0,g_vertices.length);

  duration = performance.now() - startTime;
  sendTextToHTML("ms: " + duration.toFixed(1) + " fps: " + Math.floor(1000/duration),"perf-stats");
}

function clearScreen() {
  renderAllShapes();
}

function sendTextToHTML(text,htmlID) {
  const htmlEl = document.getElementById(htmlID);
  if (!htmlEl) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlEl.innerHTML = text;
}

function tick() {
  g_seconds = performance.now()/1000.0-g_startTime;
  animate();
  render();
  requestAnimationFrame(tick);
}

function animate() {
  if (!g_animate) {
    resetAnimation();
    return;
  }

  const speed = g_seconds * 8;
  for (let joint in anims[g_currAnim]) {
    const jointInfo = anims[g_currAnim].joints[joint];
    const max = jointInfo.max;
    const min = jointInfo.min;

    const curve = (jointInfo.curve == "sin") ? Math.sin(speed) : Math.cos(speed);
    angles[joint] = (((curve) + 1) / 2) * (max - min) + min;
  }
}

function resetAnimation() {
  if (!g_animReset) {
    for (let joint in angles) {
      angles[joint] = 0;
    }
    g_animReset = true;
  }
}