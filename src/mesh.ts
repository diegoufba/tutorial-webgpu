export const triangulo = [
    [-0.8, -0.8], // p0
    [0.8, -0.8], // p1
    [0.8, 0.8], // p2
]

export const quadrado = [
    // Triangulo 1
    [-0.8, -0.8], // p0
    [0.8, -0.8], // p1
    [0.8, 0.8], // p2

    // Triangulo 2
    [0.8, 0.8], // p2
    [-0.8, 0.8], // p3
    [-0.8, -0.8], // p0
]

const azul = [0, 0, 1]
const vermelho = [1, 0, 0]

export const quadradoCores = [
    // Triangulo 1
    [-0.8, -0.8, ...azul], // p0
    [0.8, -0.8, ...azul], // p1
    [0.8, 0.8, ...azul], // p2

    // Triangulo 2
    [0.8, 0.8, ...vermelho], // p2
    [-0.8, 0.8, ...vermelho], // p3
    [-0.8, -0.8, ...vermelho], // p0
]

const p0_uv = [0, 1]
const p1_uv = [1, 1]
const p2_uv = [1, 0]
const p3_uv = [0, 0]

export const quadradoTextura = [
    // Triangulo 1
    [-0.8, -0.8, ...p0_uv], // p0
    [0.8, -0.8, ...p1_uv], // p1
    [0.8, 0.8, ...p2_uv], // p2

    // Triangulo 2
    [0.8, 0.8, ...p2_uv], // p2
    [-0.8, 0.8, ...p3_uv], // p3
    [-0.8, -0.8, ...p0_uv], // p0
]

export const getQuadradosTextura = (n: number) => {
    const result = [];
    const step = 1 / n;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            // Calcula as coordenadas do quadrado
            const x0 = -0.8 + i * 1.6 * step;
            const y0 = -0.8 + j * 1.6 * step;
            const x1 = x0 + 1.6 * step;
            const y1 = y0;
            const x2 = x1;
            const y2 = y0 + 1.6 * step;
            const x3 = x0;
            const y3 = y2;

            // Calcula as coordenadas da textura
            const u0 = i * step;
            const v0 = 1 - j * step;
            const u1 = (i + 1) * step;
            const v1 = v0;
            const u2 = u1;
            const v2 = 1 - (j + 1) * step;
            const u3 = u0;
            const v3 = v2;

            // Adiciona os dois quadrados
            result.push([x0, y0, u0, v0]); // bottom left
            result.push([x1, y1, u1, v1]); // bottom right
            result.push([x2, y2, u2, v2]); // top right

            result.push([x2, y2, u2, v2]); // top right
            result.push([x3, y3, u3, v3]); // top left
            result.push([x0, y0, u0, v0]); // bottom left
        }
    }

    return result;
}

