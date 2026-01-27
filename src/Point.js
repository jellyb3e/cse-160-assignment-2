class Point {
  constructor(position,sizeShape,colorShape) {  // apolocheese for naming conventions
    this.type = 'point';
    this.pos = position;
    this.size = sizeShape;
    this.color = colorShape;
  }

  render() {
    gl.disableVertexAttribArray(a_Position);
    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, this.pos[0], this.pos[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], 1.0);
    // Pass the size of a point to u_Size variable
    gl.uniform1f(u_Size, this.size);
    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}