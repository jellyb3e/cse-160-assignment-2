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
let duration;
let shift = false;

const g_shapes_list = [];
const g_vertices = [];
let g_globalAngleY = 0;
let g_globalAngleX = 0;
let g_animate = false;
let g_animReset = false;
let g_startTime = performance.now();
let g_currAnim = "jump";
const g_zoom = .3;
let g_rotMat;
let cube;
let cylinder;
let m_body;
let m_parent;
let g_bodyY = 0;
let g_fenceX = 0;
let g_animPhase = 0;

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();
  createGeometries();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.55, 0.67, 0.71, 1.0);

  updateGlobalRot();

  requestAnimationFrame(tick);
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
  const angRangeX = document.getElementById('angle-range-x');
  const angRangeY = document.getElementById('angle-range-y');
  const legB_j1Range = document.getElementById('legB_j1-range');
  const legB_j2Range = document.getElementById('legB_j2-range');

  angRangeX.addEventListener('input', () => {
    g_globalAngleX = angRangeX.value;
    updateGlobalRot();
    renderAllShapes();
  });

  angRangeY.addEventListener('input', () => {
    g_globalAngleY = angRangeY.value;
    updateGlobalRot();
    renderAllShapes();
  });

  legB_j1Range.addEventListener('input', () => {
    if (g_animate) return;
    angles.legBL_j1 = -legB_j1Range.value;
    renderAllShapes();
  });

  legB_j2Range.addEventListener('input', () => {
    if (g_animate) return;
    angles.legBL_j2 = -legB_j2Range.value;
    renderAllShapes();
  });

  document.getElementById("anim-on").onclick = () => { if (g_animate) {return;} g_currAnim = "run"; g_animate = true; g_animReset = false;};
  document.getElementById("anim-off").onclick = () => {g_animate = false};

  canvas.addEventListener("mousemove", (ev) => {
    if (ev.buttons != 1) return;
    dx = convertCoordinatesEventToGL(ev)[0] - lastX;
    g_globalAngleY -= dx * 90;
    if (Math.abs(g_globalAngleY) >= 360) { g_globalAngleY -= Math.sign(g_globalAngleY) * 360 }
    updateGlobalRot();
    lastX = convertCoordinatesEventToGL(ev)[0];
  });

  canvas.addEventListener("mousedown", (ev) => {
    if (ev.buttons != 1) return;
    if (shift) { 
      if (g_animate) return;
      g_currAnim = "jump"; 
      g_animate = true;
      g_animReset = false;
    }
    lastX = convertCoordinatesEventToGL(ev)[0];
  });

  document.addEventListener('keydown', (ev) => { if (ev.key == 'Shift') { shift = true; }});
  document.addEventListener('keyup', (ev) => { if (ev.key == 'Shift') { shift = false; }});
}

function updateGlobalRot() {
  g_rotMat.setRotate(g_globalAngleY,0,1,0);
  g_rotMat.rotate(g_globalAngleX,1,0,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,g_rotMat.elements);
  if(!g_animate) renderAllShapes();
}

function createGeometries() {
  g_rotMat = new Matrix4();
  cube = new Cube();
  cylinder = new Cylinder();
  m_body = new Matrix4();
  m_parent = new Matrix4();
}

function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //#region GROUND
  cube.color = [86/255.0, 168/255.0, 108/255.0, 1.0];
  cube.matrix.translate(0,-.7,0);
  cube.matrix.scale(g_zoom,g_zoom,g_zoom);
  cube.matrix.scale(5,.5,5);
  cube.render();
  cube.matrix.setIdentity();
  //#endregion

  //#region BODY
  cube.color = [1.0,1.0,1.0,1.0];
  cube.matrix.translate(0,.5 + g_bodyY,0);
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
  cube.matrix.scale(.2,length,.2);
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
  cube.bottomW = 1.3;
  cube.loadShape();
  cube.color = [0,0,0,1];
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(5+angles.legBL_j4,0,0,1);
  cube.matrix.scale(.15,.2,.15);
  cube.render();
  cube.bottomW = 1;
  cube.loadShape();

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
  cube.matrix.scale(.2,length,.2);
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
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(-45 + angles.legBR_j3,0,0,1);
  m_parent.set(cube.matrix);
  length = 2.15;
  cube.matrix.scale(.15,length,.15);
  cube.render();

  // br leg segment 4 (hoof)
  cube.bottomW = 1.3;
  cube.loadShape();
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(5+angles.legBR_j4,0,0,1);
  cube.matrix.scale(.15,.2,.15);
  cube.render();
  cube.bottomW = 1;
  cube.loadShape();
  //#endregion
  
  //#region FRONT LEFT LEG
  // fl leg segment 1
  length = .4;
  cube.color = [1,1,1,1];
  cube.matrix.set(m_body);
  cube.matrix.translate(-.4,-.65,-.2);
  cube.matrix.rotate(40 + angles.legFL_j1,0,0,1);
  m_parent.set(cube.matrix);
  cube.matrix.scale(.2,length,.2);
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
  m_parent.set(cube.matrix);
  length = 1.7;
  cube.matrix.scale(.15,length,.15);
  cube.render();

  // fl leg segment 4 (hoof)
  cube.bottomW = 1.3;
  cube.loadShape();
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(-2+angles.legFL_j4,0,0,1);
  cube.matrix.scale(.15,.2,.15);
  cube.render();
  cube.bottomW = 1;
  cube.loadShape();
  //#endregion

  //#region FRONT RIGHT LEG
  // fr leg segment 1
  length = .4;
  cube.color = [1,1,1,1];
  cube.matrix.set(m_body);
  cube.matrix.translate(-.4,-.65,.2);
  cube.matrix.rotate(40 + angles.legFR_j1,0,0,1);
  m_parent.set(cube.matrix);
  cube.matrix.scale(.2,length,.2);
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
  m_parent.set(cube.matrix);
  length = 1.7;
  cube.matrix.scale(.15,length,.15);
  cube.render();
  /**/

  // fr leg segment 4 (hoof)
  cube.bottomW = 1.3;
  cube.loadShape();
  cube.matrix.set(m_parent);
  cube.matrix.translate(0,-(length-.055),.0001);
  cube.matrix.rotate(-2+angles.legFR_j4,0,0,1);
  cube.matrix.scale(.15,.2,.15);
  cube.render();
  cube.bottomW = 1;
  cube.loadShape();
  //#endregion

  //#region NECK
  cube.bottomW = .5;
  cube.loadShape();
  cube.color = [1.0,1.0,1.0,1.0];
  cube.matrix.set(m_body);
  cube.matrix.translate(-.3,-.2,0);
  cube.matrix.rotate(-145+angles.neck,0,0,1);
  m_parent.set(cube.matrix);
  length = .45
  cube.matrix.scale(length,length,length);
  cube.render();
  //#endregion

  //#region HEAD
  cube.bottomW = .9;
  cube.loadShape();
  cube.color = [0.0,0.0,0.0,1.0];
  cube.matrix.set(m_parent);
  cube.matrix.translate(-.1,-length,0);
  cube.matrix.rotate(75+angles.head,0,0,1);
  m_parent.set(cube.matrix);
  cube.matrix.scale(.3,.5,.3);
  cube.render();
  //#endregion

  //#region EARS
  cube.bottomW = .5;
  cube.loadShape();
  cube.color = [0.0,0.0,0.0,1.0];
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
  
  //#endregion

  //#region TAIL
  cube.bottomW = .8;
  cube.loadShape();
  cube.color = [1.0,1.0,1.0,1.0];
  cube.matrix.set(m_body);
  cube.matrix.translate(.4,-.1,0);
  cube.matrix.rotate(45+angles.tail,0,0,1);
  length = .35;
  cube.matrix.scale(.2,length,.2);
  cube.render();
  cube.bottomW = 1;
  cube.loadShape();

  //#endregion
  
  //#region FENCE

  // fence post 1
  cylinder.color = [0.55, 0.27, 0.07, 1.0];
  cylinder.matrix.setIdentity();
  cylinder.matrix.translate(g_fenceX-.7,-.475,-.2);
  cylinder.matrix.scale(g_zoom,g_zoom,g_zoom);
  cylinder.matrix.scale(.1,.8,.1);
  cylinder.render();

  // fence post 2
  cylinder.matrix.setIdentity();
  cylinder.matrix.translate(g_fenceX-.7,-.475,.2);
  cylinder.matrix.scale(g_zoom,g_zoom,g_zoom);
  cylinder.matrix.scale(.1,.8,.1);
  cylinder.render();

  // fence rail 1 (top)
  cylinder.matrix.setIdentity();
  cylinder.matrix.translate(g_fenceX-.7,-.525,.24);
  cylinder.matrix.rotate(90,90,0,1);
  cylinder.matrix.scale(g_zoom,g_zoom,g_zoom);
  cylinder.matrix.scale(.1,1.6,.1);
  cylinder.render();

  // fence rail 2 (bottom)
  cylinder.matrix.setIdentity();
  cylinder.matrix.translate(g_fenceX-.7,-.625,.24);
  cylinder.matrix.rotate(90,90,0,1);
  cylinder.matrix.scale(g_zoom,g_zoom,g_zoom);
  cylinder.matrix.scale(.1,1.6,.1);
  cylinder.render();
  //#endregion

  cube.matrix.setIdentity();
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
  animate();
  duration = performance.now() - g_startTime;
  sendTextToHTML("ms: " + duration.toFixed(1) + " fps: " + Math.floor(1000/duration),"perf-stats");
  g_startTime = performance.now();
  requestAnimationFrame(tick);
}

function animate1() {
  if (!g_animate) {
    resetAnimation();
    return;
  }

  let speed = anims[g_currAnim].speed;
  if (g_currAnim == 'jump') {
    if (animationTime >= Math.PI) { g_animate = false; animationTime = 0; return; } 
    speed *= animationTime;
    animationTime += duration/1000;
  } else {
    speed *= performance.now()/1000;
  }

  const s = Math.sin(speed);
  const c = Math.cos(speed);
  for (let joint in anims[g_currAnim].joints) {
    const jointInfo = anims[g_currAnim].joints[joint];
    const max = jointInfo.max;
    const min = jointInfo.min;

    const curve = (jointInfo.curve == "sin") ? s : c;
    angles[joint] = (((curve) + 1) / 2) * (max - min) + min;
  }
  renderAllShapes();
}

function animate() {
  if (!g_animate) {
    resetAnimation();
    return;
  }

  const speed = anims[g_currAnim].speed;
  const delta = duration / 1000;

  if (g_currAnim === 'jump') {
    g_animPhase += speed * delta;

    if (g_animPhase >= 2*Math.PI) {
      g_animPhase = 0;
      g_animate = false;
      return;
    }

    const fenceInfo = anims[g_currAnim].fenceX;
    g_fenceX = fenceInfo.max * g_animPhase / (Math.PI*2);
  } else {
    g_animPhase = speed * performance.now() / 1000;
  }

  const c1 = 1 - Math.cos(g_animPhase);
  const c = Math.cos(g_animPhase);
  const s = Math.sin(g_animPhase);

  for (let joint in anims[g_currAnim].joints) {
    const jointInfo = anims[g_currAnim].joints[joint];
    angles[joint] = jointInfo.max * ((jointInfo.curve === "sin") ? s : (jointInfo.curve == "cos") ? c : c1);
  }

  const bodyInfo = anims[g_currAnim].translateY
  g_bodyY = bodyInfo.max * ((bodyInfo.curve === "sin") ? s : (bodyInfo.curve == "cos") ? c : c1);

  renderAllShapes();
}

function resetAnimation() {
  if (!g_animReset) {
    for (let joint in angles) {
      angles[joint] = 0;
    }
    g_bodyY = 0;
    g_fenceX = 0;
    g_animPhase = 0;
    g_animReset = true;
    renderAllShapes();
  }
}