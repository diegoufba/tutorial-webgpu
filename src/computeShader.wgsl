struct Input {
    @builtin(global_invocation_id) global_id: vec3<u32>,
    @builtin(num_workgroups) num_workgroups: vec3<u32>,
}    
    
    @group(0) @binding(3) var<storage,read_write> pontos: array<vec4<f32>>;

    @compute @workgroup_size(1,1)
fn main(input: Input) {
    let i = f32(input.global_id.x);
    let j = f32(input.global_id.y);
    let step = 1 / f32(input.num_workgroups.x);


    // Calcula as coordenadas do quadrado
    let x0 = -0.8 + i * 1.6 * step;
    let y0 = -0.8 + j * 1.6 * step;
    let x1 = x0 + 1.6 * step;
    let y1 = y0;
    let x2 = x1;
    let y2 = y0 + 1.6 * step;
    let x3 = x0;
    let y3 = y2;

    // Calcula as coordenadas da textura
    let u0 = i * step;
    let v0 = 1 - j * step;
    let u1 = (i + 1) * step;
    let v1 = v0;
    let u2 = u1;
    let v2 = 1 - (j + 1) * step;
    let u3 = u0;
    let v3 = v2;

    let pos: u32 = u32(i) * input.num_workgroups.x + u32(j);

    pontos[pos * 6 + 0] = vec4f(x0, y0, u0, v0);
    pontos[pos * 6 + 1] = vec4f(x1, y1, u1, v1);
    pontos[pos * 6 + 2] = vec4f(x2, y2, u2, v2);
    pontos[pos * 6 + 3] = vec4f(x2, y2, u2, v2);
    pontos[pos * 6 + 4] = vec4f(x3, y3, u3, v3);
    pontos[pos * 6 + 5] = vec4f(x0, y0, u0, v0);
}