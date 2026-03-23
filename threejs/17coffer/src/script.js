import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import vertex from './shader/vertex.glsl'
import fragment from './shader/fragment.glsl'
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}
// texture
const textureLoader = new THREE.TextureLoader()
const perlinTexture = textureLoader.load('src/static/perlin.png',(r)=> {
    console.log(r)
})
perlinTexture.wrapS = THREE.RepeatWrapping;
perlinTexture.wrapT = THREE.RepeatWrapping;


// geometry 
const plane = new THREE.PlaneGeometry(2,2,16,64)

// Material 
const material = new THREE.RawShaderMaterial({
    // 让烟雾不在遮挡自己
    depthWrite:false,
    transparent:true,
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide,
    // wireframe: true,
    uniforms: {
        uTime: new THREE.Uniform(0),
        uPerlinTexture: new THREE.Uniform(perlinTexture)
    }
})


const mesh = new THREE.Mesh(
    plane,
    material
)
mesh.scale.set(1,4,1)
scene.add(mesh)

const camera = new THREE.PerspectiveCamera(35,size.width / size.height,0.1,100)
camera.position.z = 6
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
    material.uniforms.uTime.value = elapsed
    control.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}
tick()
