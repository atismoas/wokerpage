import * as THREE from 'three'
import { OrbitControls} from 'three/addons/controls/OrbitControls.js'
import vertex from './shader/vertex.glsl'
import fragment from './shader/fragment.glsl'
import GUI from 'lil-gui'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}
const gui = new GUI()
const debugObject = {}
debugObject.surfaceColor = '#186691'
debugObject.depthColor = '#9bd8ff'
// Geometry 
const plane = new THREE.PlaneGeometry(3,3,128,128)

// Meterial
const material = new THREE.RawShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
        uTime: {value: 0},
        uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
        uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
        uColorMultipier: {value: 5},
        uuColorOffset: { value: 0.08}
    }
})

const mesh = new THREE.Mesh(
    plane,
    material
)
mesh.rotation.x = -Math.PI * 0.5

const axesHelper = new  THREE.AxesHelper()
const camera = new THREE.PerspectiveCamera(35,size.width / size.height,0.1,100)
const control = new OrbitControls(camera,canvas)
camera.position.z = 6
camera.position.y = 2
camera.rotation.x = Math.PI * 0.2

gui.addColor(debugObject,'surfaceColor').onFinishChange((color)=>{
    material.uniforms.uSurfaceColor.value =  new THREE.Color(color)
})
gui.addColor(debugObject,'depthColor').onFinishChange((color)=>{
    material.uniforms.uDepthColor.value =  new THREE.Color(color)
})


scene.add(mesh)
scene.add(axesHelper)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(size.width, size.height)
renderer.render(scene, camera)
const timer = new THREE.Timer()
const tick = function () {
    timer.update()
    const elapsed = timer.getElapsed()
    material.uniforms.uTime.value = elapsed
    control.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}
tick()