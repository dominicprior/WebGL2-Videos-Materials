// tslint:disable: no-console
console.log('hello from camera')
const vertexShaderSrc = `#version 300 es
#pragma vscode_glsllint_stage: vert

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

layout(location=0) in vec4 aPosition;
layout(location=1) in vec4 aColor;

out vec4 vColor;

void main()
{
    vColor = aColor;
    gl_Position = uProjection * uView * uModel * aPosition;
}`;

const fragmentShaderSrc = `#version 300 es
#pragma vscode_glsllint_stage: frag
precision mediump float;
in vec4 vColor;
out vec4 fragColor;
void main() {
    fragColor = vColor;
}`;

const gl = document.querySelector('canvas').getContext('webgl2');

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSrc);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSrc);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
}

gl.useProgram(program);

gl.enable(gl.DEPTH_TEST);

const vertexData = new Float32Array([
    -.5,-.5, 1.5,   1,0,1,
     .5,-.5, 1.5,   0,1,0,
     .5, .5, 1.5,   0,0,1,
     .5, .5, 1.5,   0,0.6,0,
    -.5, .5, .5,   0,0,0.7,
    -.5,-.5, .5,   1,0,0,
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);

const modelLoc = gl.getUniformLocation(program, 'uModel');
const viewLoc = gl.getUniformLocation(program, 'uView');
const projectionLoc = gl.getUniformLocation(program, 'uProjection');

const model = mat4.create();
const view = mat4.create();
const projection = mat4.create();

mat4.lookAt(view, [0,0,-0.0], // eye
        [0,0,1],   // looking at
        [0,1,0]);

// in z buffering, smaller z wins.

//mat4.perspective(projection, Math.PI / 2, 1, 
persp(projection, Math.PI / 2, 1,   // flips z
                 .2,   //near
                 null    //far
                 );
console.log('14:', projection[14])

gl.uniformMatrix4fv(viewLoc, false, view);
gl.uniformMatrix4fv(projectionLoc, false, projection);

    mat4.rotate(model, model, 0.02, [1,1,0]);
    gl.uniformMatrix4fv(modelLoc, false, model);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

function persp(out, fovy, aspect, near, far) {
    const f = 1.0  // / Math.tan(fovy / 2);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }
