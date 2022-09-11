// This is a twgl version of the original.

const vs = `#version 300 es
in vec4 aPosition;
in vec2 aTexCoord;
out vec2 vTexCoord;
void main() {
  vTexCoord = aTexCoord;
  gl_Position = aPosition;
}`;

const fs = `#version 300 es
precision mediump float;
in vec2 vTexCoord;
uniform sampler2D uSampler;
out vec4 fragColor;
void main() {
  fragColor = texture(uSampler, vTexCoord);  // texture is the modern function; texture2D is deprecated
}`;

const gl = document.querySelector('canvas').getContext('webgl2');
const programInfo = twgl.createProgramInfo(gl, [vs, fs])
gl.useProgram(programInfo.program);

const vertexBufferData = new Float32Array([ -.9,.9,  -.9,-.9,  .9,.9,  .9,-.9, ]);
const texCoordBufferData = new Float32Array([ 0,1, 0,0, 1,1, 1,0, ]);

const pixels = new Uint8Array([
	255,255,255,		230,25,75,			60,180,75,			255,225,25,
	67,99,216,			245,130,49,			145,30,180,			70,240,240,
	240,50,230,			188,246,12,			250,190,190,		0,128,128,
	230,190,255,		154,99,36,			255,250,200,		0,0,0,
]);

let arrays = {
    aPosition: { numComponents: 2, data: vertexBufferData, },
    aTexCoord: { numComponents: 2, data: texCoordBufferData, },
}
let bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)
twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)

const texture = twgl.createTexture(gl, {
    mag: gl.NEAREST,
    min: gl.LINEAR,
    src: pixels,
	width: 4,
	format: gl.RGB
});

twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLE_STRIP)
