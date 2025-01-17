// This is a reduced version of the original.

const vertexShaderSrc = `#version 300 es
in vec4 aPosition;
in vec2 aTexCoord;
out vec2 vTexCoord;
void main()
{
	vTexCoord = aTexCoord;
    gl_Position = aPosition;
}`;

const fragmentShaderSrc = `#version 300 es
precision mediump float;
in vec2 vTexCoord;
uniform sampler2D uSampler;
out vec4 fragColor;
void main()
{
    fragColor = texture(uSampler, vTexCoord);
}`;

const gl = document.querySelector('canvas').getContext('webgl2', {
	antialias: false,  // doesn't seem to slight blurring between the texels
	depth: false
  });

const program = gl.createProgram();
{
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
}
gl.useProgram(program);

const vertexBufferData = new Float32Array([
	-.9,.9,
	-.9,-.9,
	.9,.9,
	.9,-.9,
]);

const texCoordBufferData = new Float32Array([
	0,1,
	0,0,
	1,1,
	1,0,
]);

const pixels = new Uint8Array([
	255,255,255,		230,25,75,			60,180,75,			255,225,25,
	67,99,216,			245,130,49,			145,30,180,			70,240,240,
	240,50,230,			188,246,12,			250,190,190,		0,128,128,
	230,190,255,		154,99,36,			255,250,200,		0,0,0,
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexBufferData, gl.STATIC_DRAW);
const posLoc = gl.getAttribLocation(program, 'aPosition')
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(posLoc);

const texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, texCoordBufferData, gl.STATIC_DRAW);
const texLoc = gl.getAttribLocation(program, 'aTexCoord')
gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0,0);
gl.enableVertexAttribArray(texLoc);

//////// we can skip this and just pass 'pixels' directly to gl.texImage2D() ////////
//const pixelBuffer = gl.createBuffer();
//gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, pixelBuffer);
//gl.bufferData(gl.PIXEL_UNPACK_BUFFER, pixels, gl.STATIC_DRAW);

const textureSlot = 0;
//gl.activeTexture(gl.TEXTURE0 + textureSlot);                             // doesn't seem to be necessary if textureSlot is zero.
//gl.uniform1i(gl.getUniformLocation(program, 'uSampler'), textureSlot);   // doesn't seem to be necessary if textureSlot is zero.

const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(gl.TEXTURE_2D,  // bind target
	          0,  // mipmap level
			  gl.RGB, // format used by the fragment shader
			  4,4,  // width and height of the source image
			  0,  // always zero
			  gl.RGB,  // source format
			  gl.UNSIGNED_BYTE,
			  pixels);  // offset in bytes into the texture pixel array

gl.generateMipmap(gl.TEXTURE_2D);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
