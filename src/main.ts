import renderShader from './renderShader.wgsl?raw'
import computeShader from './computeShader.wgsl?raw'
import { triangle, quadrado, quadradoCores, quadradoTextura, getQuadradosTextura } from './mesh';

async function main() {
  //Configuração básica do Webgpu ******************************************************

  // Obtém o elemento canvas do DOM
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;

  // Verifica se o navegador suporta WebGPU
  if (!navigator.gpu) {
    throw new Error("WebGPU not supported on this browser.");
  }

  // Solicita um adaptador de GPU
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error("No appropriate GPUAdapter found.");
  }

  // Solicita um dispositivo de GPU do adaptador
  const device: GPUDevice = await adapter.requestDevice();

  // Obtém o contexto WebGPU do canvas
  const context = canvas.getContext('webgpu');
  if (!context) {
    throw new Error("WebGPU context not available.");
  }

  // Obtém o formato de textura preferido para o canvas
  const canvasFormat: GPUTextureFormat = navigator.gpu.getPreferredCanvasFormat();

  // Configura o contexto com o dispositivo GPU e o formato do canvas
  context.configure({
    device: device,
    format: canvasFormat
  });

  //************************************************************************************

  //Configuração dos Pontos de Entrada *************************************************
  const n = 5

  const vertices = getQuadradosTextura(n)

  const nPontos = vertices.length

  const verticesArray = new Float32Array(vertices.flat())

  const verticesBuffer: GPUBuffer = device.createBuffer({
    label: 'Vertices',
    size: verticesArray.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  })

  device.queue.writeBuffer(verticesBuffer, 0, verticesArray)

  // const verticesBufferLayout: GPUVertexBufferLayout = {
  //   arrayStride: 8,
  //   attributes: [{
  //     format: 'float32x2',
  //     offset: 0,
  //     shaderLocation: 0
  //   }]
  // }
  // const verticesBufferLayout: GPUVertexBufferLayout = {
  //   arrayStride: 20,
  //   attributes: [
  //     {
  //       format: 'float32x2',
  //       offset: 0,
  //       shaderLocation: 0
  //     },
  //     {
  //       format: 'float32x3',
  //       offset: 8,
  //       shaderLocation: 1
  //     },
  //   ]
  // }

  const verticesBufferLayout: GPUVertexBufferLayout = {
    arrayStride: 16,
    attributes: [
      {
        format: 'float32x2',
        offset: 0,
        shaderLocation: 0
      },
      {
        format: 'float32x2',
        offset: 8,
        shaderLocation: 1
      },
    ]
  }
  //************************************************************************************

  //Configuração dos Uniformes *********************************************************
  let tamanho = 1 / 4
  let tempo = 0

  const parametrosBufferArray = new Float32Array([tamanho, tempo])

  const parametrosBuffer: GPUBuffer = device.createBuffer({
    label: 'Uniform buffer',
    size: parametrosBufferArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })
  device.queue.writeBuffer(parametrosBuffer, 0, parametrosBufferArray)
  //************************************************************************************

  //Configuração da Textura ************************************************************
  const res = await fetch('/textura.png')
  const blob = await res.blob()
  const source = await createImageBitmap(blob, { colorSpaceConversion: 'none' })

  const texture: GPUTexture = device.createTexture({
    label: 'Textura',
    format: 'rgba8unorm',
    size: [source.width, source.height],
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
  })

  device.queue.copyExternalImageToTexture(
    { source },
    { texture },
    { width: source.width, height: source.height }
  )

  const sampler: GPUSampler = device.createSampler();
  //************************************************************************************

  //Configuração do Render *************************************************************
  const bindGroupLayoutRender: GPUBindGroupLayout = device.createBindGroupLayout({
    label: 'Bind Group Layout Render',
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      },
      {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {}
      },
      {
        binding: 2,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: 'uniform' }
      },
    ]
  })

  const bindGroupRender = device.createBindGroup({
    label: 'Bind Group',
    layout: bindGroupLayoutRender,
    entries: [
      {
        binding: 0,
        resource: texture.createView()
      },
      {
        binding: 1,
        resource: sampler
      },
      {
        binding: 2,
        resource: { buffer: parametrosBuffer }
      },
    ]
  })

  const pipelineLayoutRender = device.createPipelineLayout({
    label: 'Pipeline Layout Render',
    bindGroupLayouts: [bindGroupLayoutRender],
  })

  const renderShaderModule: GPUShaderModule = device.createShaderModule({
    label: 'Render shader',
    code: renderShader
  })

  const renderPipeline: GPURenderPipeline = device.createRenderPipeline({
    label: 'Render Pipeline',
    layout: pipelineLayoutRender,
    vertex: {
      module: renderShaderModule,
      entryPoint: "vertexMain",
      buffers: [verticesBufferLayout]
    },
    fragment: {
      module: renderShaderModule,
      entryPoint: 'fragmentMain',
      targets: [{
        format: canvasFormat
      }]
    },
    primitive: {
      topology: 'triangle-list'
      // topology: 'point-list'
    }
  })
  //************************************************************************************


  const tempoInicial = Date.now()
  const velocidade = 1 / 1000
  function render() {

    tempo = (Date.now() - tempoInicial) * velocidade
    parametrosBufferArray[1] = tempo
    device.queue.writeBuffer(parametrosBuffer, 0, parametrosBufferArray)

    const encoder: GPUCommandEncoder = device.createCommandEncoder()
    const textureView: GPUTextureView = context!.getCurrentTexture().createView()
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [{
        view: textureView,
        loadOp: 'clear',
        clearValue: { r: 0, g: 0, b: 0, a: 1 },
        storeOp: 'store'
      }]
    }
    const renderPass: GPURenderPassEncoder = encoder.beginRenderPass(renderPassDescriptor)
    renderPass.setPipeline(renderPipeline)
    renderPass.setBindGroup(0, bindGroupRender)
    renderPass.setVertexBuffer(0, verticesBuffer)
    renderPass.draw(nPontos)
    renderPass.end()
    device.queue.submit([encoder.finish()])

    window.requestAnimationFrame(render)
  }

  render()

}

main()
