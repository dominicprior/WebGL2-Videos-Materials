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
  fragColor = texture(uSampler, vTexCoord);
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

const pixelBuffer = gl.createBuffer();
gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, pixelBuffer);
gl.bufferData(gl.PIXEL_UNPACK_BUFFER, pixels, gl.STATIC_DRAW);

const textureSlot = 1;
gl.activeTexture(gl.TEXTURE0 + textureSlot);
gl.uniform1i(gl.getUniformLocation(programInfo.program, 'uSampler'), textureSlot);

const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(gl.TEXTURE_2D,
	          0,  // mipmap level
			  gl.RGB, // format used by the fragment shader
			  4, 4,   // width and height of the source image
			  0,      // always zero
			  gl.RGB, // source format
			  gl.UNSIGNED_BYTE,
			  0);     // offset in bytes into the texture pixel array

gl.generateMipmap(gl.TEXTURE_2D);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLE_STRIP)
