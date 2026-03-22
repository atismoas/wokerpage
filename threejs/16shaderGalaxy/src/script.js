import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import vertex from './shader/vertex.glsl'
import fragment from './shader/fragment.glsl'


const canvas = document.querySelector("canvas.webgl")
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
const scene = new THREE.Scene()
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}
const count = 300000
const axesHelper = new THREE.AxesHelper()
const debugObject = {}
debugObject.insideColor = new THREE.Color('#ff6030')
debugObject.outsideColor = new THREE.Color('#1b3984')

// goemetry
const points = new THREE.BufferGeometry()
const pointsArr = new Float32Array(count * 3)
const pointColorArr = new Float32Array(count * 3)
const rondomness = new Float32Array(count * 3)
const scaleArr = new Float32Array(count)

for(let i=0;i < count; i++ ){
    const branches = 3
    const radius = 5 * Math.random()
    const spinAngle = radius * 0.01

    const randomX = Math.pow(Math.random() ,3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * radius
    const randomY = Math.pow(Math.random() ,3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * radius
    const randomZ = Math.pow(Math.random() , 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * radius

    rondomness[i* 3] = randomX;
    rondomness[i* 3 + 1] = randomY;
    rondomness[i* 3 + 2] = randomZ;

    pointsArr[i * 3] = Math.sin(Math.PI * 2 / branches * (i % branches) + spinAngle) * radius + randomX
    pointsArr[i * 3 + 1] = randomY
    pointsArr[i* 3 + 2] = Math.cos(Math.PI * 2  / branches * (i % branches) + spinAngle) * radius + randomZ

    const mixColor = debugObject.insideColor.clone()
    mixColor.lerp(debugObject.outsideColor,radius / 5)
    pointColorArr[i * 3] = mixColor.r
    pointColorArr[i * 3 + 1] = mixColor.g
    pointColorArr[i * 3 + 2] = mixColor.b

    scaleArr[i] = Math.random()
}
points.setAttribute('position',new THREE.BufferAttribute(pointsArr,3))
points.setAttribute('color', new THREE.BufferAttribute(pointColorArr,3))
points.setAttribute('aScale', new THREE.BufferAttribute(scaleArr,1))
points.setAttribute('aRandom', new THREE.BufferAttribute(rondomness,3))

const material = new THREE.RawShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
        uSize: {value: 30 * renderer.getPixelRatio()},
        uTime: {value: 0}
    }
})

// const material = new THREE.PointsMaterial({
//     // vertexShader: vertex,
//     // fragmentShader: fragment,
//     vertexColors: true,
//     // color: 'red',
//     size: 0.02
// })

const mesh = new THREE.Points(
    points,
    material
)

const camera = new THREE.PerspectiveCamera(35,size.width / size.height,0.1,1000)
camera.position.z = 6
const control = new OrbitControls(camera,canvas)

scene.add(mesh)
scene.add(axesHelper)


renderer.setSize(size.width,size.height)
renderer.render(scene,camera)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
const timer = new THREE.Timer()
const tick= function() {
    timer.update()
    const elapsed =  timer.getElapsed()
    material.uniforms.uTime.value = elapsed
    control.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}
tick()
