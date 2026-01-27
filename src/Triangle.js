class Triangle {
  constructor(position,sizeShape,colorShape) {  // apolocheese for naming conventions
    this.type = 'triangle';
    this.pos = position;
    this.size = sizeShape;
    this.color = colorShape;
  }

  render() {
    console.log(this.pos)
    gl.uniform4f(u_FragColor,this.color[0],this.color[1],this.color[2],1.0);
    gl.uniform1f(u_Size,this.size);
    const d = this.size/200.0;
    drawTriangle([this.pos[0],this.pos[1],this.pos[0],this.pos[1]+d,this.pos[0]+d,this.pos[1]]);
  }
}

function drawTriangle(vertices) {
  var n = 3;
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES,0,n);
  return n;
}
