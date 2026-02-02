class Cylinder {
    constructor() {
        this.type = 'cylinder';
        this.color = [1.0,1.0,1.0,1.0];
        this.matrix = new Matrix4();
        this.segments = 10;

        this.vertexBuffer = gl.createBuffer();
        this.vertexCount = 0;

        this.loadShape();
    }

    loadShape() {
        const vertices = [];

        const radius = 0.5;
        const top_y = 0;
        const bottom_y = -1;
        const step_size = 2.0 * Math.PI / this.segments;

        for (let ang = 0; ang < 2.0 * Math.PI; ang += step_size) {
            console.log("side");
            const x0 = Math.cos(ang) * radius;
            const z0 = Math.sin(ang) * radius;
            const x1 = Math.cos(ang + step_size) * radius;
            const z1 = Math.sin(ang + step_size) * radius;

            // side face
            vertices.push(x0, bottom_y, z0, x1, bottom_y, z1, x1, top_y, z1);
            vertices.push(x0, bottom_y, z0, x1, top_y, z1, x0, top_y, z0);

            // top circle
            vertices.push(0, top_y, 0, x0, top_y, z0, x1, top_y, z1);

            // bottom circle
            vertices.push(0, bottom_y, 0, x1, bottom_y, z1, x0, bottom_y, z0);
        }

        this.vertexCount = vertices.length / 3;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
    }


    render() {
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    }
}