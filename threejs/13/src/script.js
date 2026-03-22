import * as THREE from "three"
import { OrbitControls} from "three/addons/controls/OrbitControls.js"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import {HDRLoader} from 'three/addons/loaders/HDRLoader.js'
import GUI from 'lil-gui'

const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}
const gui = new GUI()
const axesHelper = new THREE.AxesHelper()
const global = {}
global.envMapIntensity = 1

const updateAllMaterial = function(){
    scene.traverse((child)=>{
        // console.log(child)
        if(child.isMesh && child.material.isMeshStandardMaterial){
            child.castShadow = true
            child.receiveShadow = true
            child.material.envMapIntensity = global.envMapIntensity
            // child.material.needsUpdate = true
        }
    })
}


const gltfLoader = new GLTFLoader()
gltfLoader.load(
    'glTF/FlightHelmet.gltf',
    (gltf) => {
        console.log(gltf)
        // gltf.scene.scale.set(10,10,10)
        scene.add(gltf.scene)
        updateAllMaterial()
    }
)
const hdrLoader = new HDRLoader()

// /environmentMaps/0/2k.hdr
// gltf/sunny_rose_garden_1k.hdr
hdrLoader.load('/environmentMaps/0/2k.hdr',(envMap)=>{
    envMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = envMap
    scene.environment = envMap
})
const textureLoader = new THREE.TextureLoader()
const brickArmText = textureLoader.load('textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg')
const brickdiffText = textureLoader.load('textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg')
const brickNorText = textureLoader.load('textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png')
brickdiffText.colorSpace = THREE.SRGBColorSpace
const woodArmText = textureLoader.load('textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg')
const wooddiffText = textureLoader.load('textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg')
const woodNorText = textureLoader.load('textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png')
wooddiffText.colorSpace = THREE.SRGBColorSpace


// Light
const ambientLight = new THREE.AmbientLight('#fff',2)

const directionLight = new THREE.DirectionalLight('#fff',2)
// 如果不添加阴影效果，阴影相机助手将始终默认设置
directionLight.castShadow = true
directionLight.shadow.mapSize.set(512,512)
const directionLightHelper = new THREE.CameraHelper(directionLight.shadow.camera)
directionLight.position.set(0.3,2.5,2.3)



// target
directionLight.target.position.set(0,0.4,0)
directionLight.shadow.camera.top = 0.8
directionLight.shadow.camera.bottom = -0.8
directionLight.shadow.camera.left = -1
directionLight.shadow.camera.right = 1
directionLight.shadow.camera.near = 1
directionLight.shadow.camera.far = 10
directionLight.target.updateWorldMatrix()

// Mesh
const brick = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    new THREE.MeshStandardMaterial({
        map: brickdiffText,
        normalMap: brickNorText,
        aoMap: brickArmText,
        roughnessMap:brickArmText,
        metalnessMap: brickArmText
    })
)
brick.position.z = -0.44
brick.position.y = 0.5

const wood = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    new THREE.MeshStandardMaterial({
        map: wooddiffText,
        normalMap:woodNorText,
        aoMap:woodArmText,
        roughnessMap:woodArmText,
        metalnessMap:woodArmText
    })
)
wood.rotation.x = - Math.PI * 0.5
brick.castShadow = true
brick.receiveShadow = true
wood.receiveShadow = true

const camera = new THREE.PerspectiveCamera(35,size.width / size.height,0.1,100)
camera.position.z = 6

gui.add(global,'envMapIntensity').min(0).max(10111).step(0.01).onFinishChange(updateAllMaterial)
gui.add(directionLight.position,'x').min(-10).max(10).step(0.1)
gui.add(directionLight.position,'y').min(-10).max(10).step(0.1)
gui.add(directionLight.position,'z').min(-10).max(10).step(0.1)


// scene.add(ambientLight)
// scene.add(axesHelper)
scene.add(brick)
scene.add(wood)
scene.add(directionLight.target)
// scene.add(directionLight)
// scene.add(directionLightHelper)

const control = new OrbitControls(camera,canvas)
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(size.width,size.height)
renderer.render(scene,camera)
renderer.toneMapping = THREE.ACESFilmicToneMapping // 色调映射
renderer.toneMappingExposure = 1
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap


const tick = function (){
    control.update()
    directionLightHelper.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}

tick()