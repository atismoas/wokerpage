import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import testVertex from './shader/testVertex.glsl'
import fragment from './shader/fragment.glsl'
import GUI from 'lil-gui'


const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()
const gui = new GUI()

const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Texture
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load(
    'src/cn.jpg',
    (e)=> {
        // console.log(e)
    }
)


// Light   
const ambientLight = new THREE.AmbientLight('#fff',2)

// Meterial
const material = new THREE.RawShaderMaterial({
    vertexShader: testVertex,
    fragmentShader: fragment,
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10,5)},
        uTime: { value: 0},
        uColor: { value: new THREE.Color('purple')},
        uTexture: { value: flagTexture}
    }
})
gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20)
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20)

// Geometry 
const geometry = new THREE.PlaneGeometry(3,3,32,32)
const count = geometry.attributes.position.count
const randoms = new Float32Array(count)
for(let i=0;i< count;i++){
    randoms[i]= Math.random()
}
geometry.setAttribute('aRandom',new THREE.BufferAttribute(randoms,1))



// Mesh
const plane = new THREE.Mesh(
    geometry,
    // new THREE.MeshStandardMaterial({
    //     wireframe: true,
    //     color: "red"
    // })
    material
)

const camera = new THREE.PerspectiveCamera(35,size.width/size.height,0.1,100)
camera.position.z = 6
const control = new OrbitControls(camera,canvas)
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})

scene.add(ambientLight)
scene.add(plane)

renderer.setSize(size.width,size.height)
renderer.render(scene,camera)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

const timer = new THREE.Timer()

const tick = function(){
    timer.update()
    const elapsed = timer.getElapsed()

    material.uniforms.uTime.value = elapsed;

    control.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}
tick()