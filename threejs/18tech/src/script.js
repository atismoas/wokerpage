import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import vertex from './shader/vertex.glsl'
import fragment from './shader/fragment.glsl'
import GUI from 'lil-gui'
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}
const gui  = new GUI()
const debugObject = {}
debugObject.color = '#78c1ff'
const axesHelper = new THREE.AxesHelper()
// texture
const textureLoader = new THREE.TextureLoader()
const perlinTexture = textureLoader.load('src/static/perlin.png',(r)=> {
    console.log(r)
})
perlinTexture.wrapS = THREE.RepeatWrapping;
perlinTexture.wrapT = THREE.RepeatWrapping;
const camera = new THREE.PerspectiveCamera(35,size.width / size.height,0.1,100)
camera.position.z = 6


// geometry 
const plane = new THREE.SphereGeometry(2,16,64)

// Material 
const material = new THREE.RawShaderMaterial({
    // 让烟雾不在遮挡自己
    depthWrite:false,
    // 相加混合
    blending: THREE.AdditiveBlending,
    transparent:true,
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide,
    // wireframe: true,
    uniforms: {
        uTime: new THREE.Uniform(0),
        uPerlinTexture: new THREE.Uniform(perlinTexture),
        uCameraPosition: new THREE.Uniform(camera.position),
        uColor: new THREE.Uniform(new THREE.Color(debugObject.color))
    }
})

gui.addColor(debugObject,'color').onFinishChange((col)=> {
    material.uniforms.uColor.value.set(col)
})  


const mesh = new THREE.Mesh(
    plane,
    material
)

// mesh.scale.set(1,4,1)
scene.add(mesh)
scene.add(axesHelper)

const control = new OrbitControls(camera,canvas)
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(size.width,size.height)
renderer.render(scene, camera)
const timer = new THREE.Timer()
const tick = function(){
    timer.update()
    const elapsed = timer.getElapsed()
    const delta = timer.getDelta()
    material.uniforms.uTime.value = elapsed
    mesh.rotation.y += delta * 0.2
    mesh.rotation.z += delta * 0.2
    control.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}
tick()
