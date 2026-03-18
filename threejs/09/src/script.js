import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { mix } from "three/src/nodes/math/MathNode.js"

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const gui = new GUI()

const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load(
    'src/particles/8.png'
)
const parameters = {
    count: 50000,
    size: 0.02,
    radius: 10,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 2,
    insideColor : '#ff3c30',
    outsideColor: '#1b7184'
}

let stars = null
let starMaterial = null
let galaxy = null

const generateGalaxy = function() {
    if(galaxy !== null){
        stars.dispose()
        starMaterial.dispose()
        scene.remove(galaxy)
    }

    // Geometry
    stars = new THREE.BufferGeometry()
    const starsArray = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const insideColor = new THREE.Color(parameters.insideColor)
    const outsideColor = new THREE.Color(parameters.outsideColor)
    for(let i = 0;i< parameters.count;i++){
        const i3 = 3* i
        const branshAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        //  * parameters.radius
        const radius = parameters.radius * Math.random()
        const spinAngle = radius * parameters.spin

        const randomX = Math.pow(Math.random() , parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random() , parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random() , parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        starsArray[i3] = Math.cos(branshAngle + spinAngle) * radius + randomX
        starsArray[i3 + 1] =  randomY
        starsArray[i3 + 2] = Math.sin(branshAngle + spinAngle) * radius + randomZ

        // colors
        const sideColor = insideColor.clone()
        const mixColor = sideColor.lerp(outsideColor,radius / parameters.radius)
        colors[i3] = mixColor.r;
        colors[i3 + 1] = mixColor.g;
        colors[i3 + 2] = mixColor.b;
    }
    stars.setAttribute(
        "position",
        new THREE.BufferAttribute(starsArray,3)
    )
    // Color
    stars.setAttribute(
        "color",
        new THREE.BufferAttribute(colors,3)
    )
    // Material
    starMaterial = new THREE.PointsMaterial()
    starMaterial.size = parameters.size
    starMaterial.sizeAttenuation = true
    starMaterial.vertexColors = true
    starMaterial.blending = THREE.AdditiveBlending

    // MeshGalaxy
    galaxy = new THREE.Points(
        stars,
        starMaterial
    )

    scene.add(galaxy)
}

generateGalaxy()

gui.add(parameters,'count').min(500).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters,'radius').min(1).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters,'size').min(0.02).max(0.2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'branches').min(2).max(10).step(1).onFinishChange(generateGalaxy)
gui.add(parameters,'randomness').min(0.1).max(1).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,'randomnessPower').min(2).max(10).step(1).onFinishChange(generateGalaxy)
gui.add(parameters,'spin').min(0.1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters,'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters,'outsideColor').onFinishChange(generateGalaxy)



// #region
// Geometry
const particlesGeometry = new THREE.BufferGeometry()

const count = 5000
const pointArr = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for(let i=0;i < count * 3;i++) {
    pointArr[i] = (Math.random() -0.5)* 10
    colors[i] = Math.random()
}
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(pointArr,3)
)
particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors,3)
)


// Material
const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.2
// particlesMaterial.color = new THREE.Color('#ff88cc')
// 透视选项
// particlesMaterial.sizeAttenuation = true
particlesMaterial.transparent = true
particlesMaterial.alphaMap = texture
particlesMaterial.alphaTest = 0.001
particlesMaterial.vertexColors = true


const points = new THREE.Points(particlesGeometry,particlesMaterial)

const camera = new THREE.PerspectiveCamera(45,size.width / size.height)
camera.position.z = 3
const controls = new OrbitControls(camera,canvas)
// #endregion

//scene.add(points)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(size.width, size.height)
renderer.render(scene,camera)

const timer = new THREE.Timer()

const tick = function () {
    timer.update()
    const elapsd = timer.getElapsed()
    const delta = timer.getDelta()
    galaxy.rotation.y += delta * 0.2
    
    // update Particles
    // for( let i =0;i< count ; i++){
    //     const i3 = i * 3
    //     const x = particlesGeometry.attributes.position.array[i3 + 0]
    //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsd + x)
    // }
    // particlesGeometry.attributes.position.needsUpdate = true
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()