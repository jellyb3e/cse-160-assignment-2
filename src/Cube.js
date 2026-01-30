class Cube {
    constructor(topWidth = 1.0, bottomWidth = 1.0) {
        this.type = 'cube';
        this.color = [1.0,1.0,1.0,1.0];
        this.matrix = new Matrix4();
        this.topW = topWidth;
        this.bottomW = bottomWidth;
    }

    render() {
        drawCube(this.matrix,this.color,this.topW,this.bottomW)
    }
}

function drawCube(M,color,topWidth = 1.0, bottomWidth = 1.0) {
    gl.uniform4f(u_FragColor,color[0],color[1],color[2],color[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, M.elements);

    t_half = topWidth/2;
    b_half = bottomWidth/2;

    // front
    drawTriangle3D([-b_half,-1,-b_half,   t_half,0,-b_half,   b_half,-1,-b_half]);
    drawTriangle3D([-b_half,-1,-b_half,  -t_half,0,-b_half,   t_half,0,-b_half]);
    //g_vertices.push([-b_half,-1,-b_half,   t_half,0,-b_half,   b_half,-1,-b_half]);
    //g_vertices.push([-b_half,-1,-b_half,  -t_half,0,-b_half,   t_half,0,-b_half]);

    // back
    drawTriangle3D([-b_half,-1,b_half,   b_half,-1,b_half,   t_half,0,b_half]);
    drawTriangle3D([-b_half,-1,b_half,   t_half,0,b_half,  -t_half,0,b_half]);
    //g_vertices.push([-b_half,-1,b_half,   b_half,-1,b_half,   t_half,0,b_half]);
    //g_vertices.push([-b_half,-1,b_half,   t_half,0,b_half,  -t_half,0,b_half]);

    // left
    drawTriangle3D([-b_half,-1,-b_half,  -b_half,-1,b_half,  -t_half,0,t_half]);
    drawTriangle3D([-b_half,-1,-b_half,  -t_half,0,t_half,  -t_half,0,-t_half]);
    //g_vertices.push([-b_half,-1,-b_half,  -b_half,-1,b_half,  -t_half,0,t_half]);
    //g_vertices.push([-b_half,-1,-b_half,  -t_half,0,t_half,  -t_half,0,-t_half]);

    // right
    drawTriangle3D([ b_half,-1,-b_half,   t_half,0,t_half,   b_half,-1,b_half]);
    drawTriangle3D([ b_half,-1,-b_half,   t_half,0,-t_half,   t_half,0,t_half]);
    //g_vertices.push([ b_half,-1,-b_half,   t_half,0,t_half,   b_half,-1,b_half]);
    //g_vertices.push([ b_half,-1,-b_half,   t_half,0,-t_half,   t_half,0,t_half]);

    // top
    drawTriangle3D([-t_half,0,-t_half,   t_half,0,-t_half,   t_half,0, t_half]);
    drawTriangle3D([-t_half,0,-t_half,   t_half,0, t_half,  -t_half,0, t_half]);
    //g_vertices.push([-t_half,0,-t_half,   t_half,0,-t_half,   t_half,0, t_half]);
    //g_vertices.push([-t_half,0,-t_half,   t_half,0, t_half,  -t_half,0, t_half]);

    // bottom
    drawTriangle3D([-b_half,-1,-b_half,   b_half,-1,-b_half,   b_half,-1,b_half]);
    drawTriangle3D([-b_half,-1,-b_half,  -b_half,-1,b_half,   b_half,-1,b_half]);
    //g_vertices.push([-b_half,-1,-b_half,   b_half,-1,-b_half,   b_half,-1,b_half]);
    //g_vertices.push([-b_half,-1,-b_half,  -b_half,-1,b_half,   b_half,-1,b_half]);
}


function drawTriangle3D(vertices) {
    // create buffer object
    vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES,0,3);
}