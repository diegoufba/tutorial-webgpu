@vertex
fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
    return vec4f(pos.x,pos.y,0.0, 1.0);
}

@fragment
fn fragmentMain() -> @location(0) vec4f {
    return vec4f(1,0,0,1);
}

// struct VertexInput {
//     @location(0) pos: vec2f,
//     @location(1) cor: vec3f
// }

// struct VertexOutput {
//     @builtin(position) pos: vec4f,
//     @location(0) cor: vec3f
// }

// @vertex
// fn vertexMain(vertexInput: VertexInput) -> VertexOutput {
//     var vertexOutput: VertexOutput;
//     vertexOutput.pos = vec4f(vertexInput.pos.x, vertexInput.pos.y, 0.0, 1.0);
//     vertexOutput.cor = vertexInput.cor;
//     return vertexOutput;
// }

// @fragment
// fn fragmentMain(fragInput: VertexOutput) -> @location(0) vec4f {
//     return vec4f(fragInput.cor, 1.0);
// }

// struct VertexInput {
//     @location(0) pos: vec2f,
//     @location(1) uv: vec2f
// }

// struct VertexOutput {
//     @builtin(position) pos: vec4f,
//     @location(0) uv: vec2f
// }

// @group(0) @binding(0) var myTexture: texture_2d<f32>;
// @group(0) @binding(1) var mySample: sampler;

// @vertex
// fn vertexMain(vertexInput: VertexInput) -> VertexOutput {
//     var vertexOutput: VertexOutput;
//     vertexOutput.pos = vec4f(vertexInput.pos.x, vertexInput.pos.y, 0.0, 1.0);
//     vertexOutput.uv = vertexInput.uv;
//     return vertexOutput;
// }

// @fragment
// fn fragmentMain(fragInput: VertexOutput) -> @location(0) vec4f {
//     return textureSample(myTexture, mySample, fragInput.uv);
// }

// struct VertexInput {
//     @location(0) pos: vec2f,
//     @location(1) uv: vec2f
// }

// struct VertexOutput {
//     @builtin(position) pos: vec4f,
//     @location(0) uv: vec2f
// }

// struct Parametros {
//     tamanho: f32,
//     tempo: f32,
// }

// @group(0) @binding(0) var myTexture: texture_2d<f32>;
// @group(0) @binding(1) var mySample: sampler;
// @group(0) @binding(2) var<uniform> parametros: Parametros;

// @vertex
// fn vertexMain(vertexInput: VertexInput) -> VertexOutput {
//     var vertexOutput: VertexOutput;

//     var x = vertexInput.pos.x * parametros.tamanho;
//     var y = vertexInput.pos.y * parametros.tamanho;

//     // let translacao = sin(parametros.tempo);
//     // let translacao2 = cos(parametros.tempo);
//     // x = x + translacao;
//     // y = y + translacao2;
//     y = y + sin(parametros.tempo + x * 10) / 12;

//     vertexOutput.pos = vec4f(x, y, 0.0, 1.0);
//     vertexOutput.uv = vertexInput.uv;
//     return vertexOutput;
// }

// @fragment
// fn fragmentMain(fragInput: VertexOutput) -> @location(0) vec4f {
//     return textureSample(myTexture, mySample, fragInput.uv);
// }


// struct VertexOutput {
//     @builtin(position) pos: vec4f,
//     @location(0) uv: vec2f
// }

// struct Parametros {
//     tamanho: f32,
//     tempo: f32,
// }

// @group(0) @binding(0) var myTexture: texture_2d<f32>;
// @group(0) @binding(1) var mySample: sampler;
// @group(0) @binding(2) var<uniform> parametros: Parametros;
// @group(0) @binding(3) var<storage> pontos: array<vec4<f32>>;

// @vertex
// fn vertexMain(@builtin(vertex_index) vertex_index: u32) -> VertexOutput {
//     let ponto = pontos[vertex_index];

//     let translacao = sin(parametros.tempo);

//     var x = ponto[0] * parametros.tamanho;
//     var y = ponto[1] * parametros.tamanho;
//     y = y +sin(parametros.tempo + x * 10) / 12;

//     let position = vec4f(x, y, 0.0, 1.0);

//     var output: VertexOutput;
//     output.pos = position;
//     output.uv = vec2f(ponto[2], ponto[3]);
//     return output;
// }

// @fragment
// fn fragmentMain(fragInput: VertexOutput) -> @location(0) vec4f {
//     return textureSample(myTexture, mySample, fragInput.uv);
// }



