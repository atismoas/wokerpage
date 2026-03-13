import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { pingpong } from "three/src/math/MathUtils.js"

const size = {
    width: window.innerWidth,
    height: window.innerHeight
}
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper()

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)

const textureLoader = new THREE.TextureLoader()
const textShadow = textureLoader.load(
    'src/textures/1.jpg'
)


const shadowGeo = new THREE.PlaneGeometry(1,1)
const shadowMaterial = new THREE.MeshStandardMaterial()
shadowMaterial.map = textShadow
const meshShadow = new THREE.Mesh(
    shadowGeo,
    shadowMaterial
)
meshShadow.position.y = 0.01
meshShadow.rotation.x = - Math.PI* 0.5

// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
directionalLight.position.set(2,2,-1)
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.left = -2
directionalLight.castShadow = true
directionalLight.shadow.radius = 10

const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightHelper.visible = false

// 聚光灯
const spotLight = new THREE.SpotLight(0xffffff,0.7,10,Math.PI* 0.3)
spotLight.castShadow = true
spotLight.position.set(0,2,2)
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 40
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightHelper.visible = false
scene.add(spotLightHelper)

// 点光源
const pointLight = new THREE.PointLight(0xffffff,0.5)
pointLight.castShadow = true
pointLight.position.set(-1,1,0)
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightHelper.visible = false

const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4
// material.metalness = 0.4
// material.color = new THREE.Color(0xff0000)
const sphere = new THREE.SphereGeometry(0.5,16,16)
const sphereMesh = new THREE.Mesh(
    sphere,
    material
)
sphereMesh.position.y = 0.5
sphereMesh.castShadow = true

const background = new THREE.PlaneGeometry(5,5)
const mesh = new THREE.Mesh(
    background,
    material
)
mesh.rotation.x = - Math.PI * 0.5
mesh.receiveShadow = true

const camera = new THREE.PerspectiveCamera(75,size.width / size.height ,1 ,100)
camera.position.z = -3
const control = new OrbitControls(camera,canvas)

// scene.add(ambientLight)
scene.add(mesh)
scene.add(sphereMesh)
// scene.add(axesHelper)
scene.add(camera)
scene.add(directionalLight)
scene.add(directionalLightHelper)
scene.add(spotLight)
scene.add(spotLight.target)
scene.add(pointLight)
scene.add(pointLightHelper)
scene.add(meshShadow)



const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(size.width,size.height)
renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFShadowMap
renderer.render(scene,camera)

const timer = new THREE.Timer()

const tick = function() {
    timer.update()
    const elapsed = timer.getElapsed()
    console.log(elapsed)

    sphereMesh.position.x = Math.sin(elapsed) * 1.5
    sphereMesh.position.z = Math.cos(elapsed) * 1.5
    sphereMesh.position.y = Math.abs(Math.cos(elapsed)) + 0.5
    
    
    meshShadow.position.x = Math.sin(elapsed) * 1.5
    meshShadow.position.z = Math.cos(elapsed) * 1.5
    meshShadow.material.opacity = (1 - sphereMesh.position.y) * 0.3

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()
