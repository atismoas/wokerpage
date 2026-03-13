import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4
material.side = THREE.DoubleSide

// material.color = new THREE.Color(0xff0000)
// material.wireframe = true

const geometry1 = new THREE.BoxGeometry(0.8,0.8,0.8)
const sphereGeometry = new THREE.SphereGeometry(0.5,16,16)
const torusGeometry = new THREE.TorusGeometry(0.3,0.2,16,32)


const geometryGround = new THREE.PlaneGeometry(1,1)
const materialGround = new THREE.MeshBasicMaterial()
materialGround.side = THREE.DoubleSide
const meshGround = new THREE.Mesh(
    geometryGround,
    material
)
meshGround.rotation.x = Math.PI * 0.5
meshGround.scale.x = 5
meshGround.scale.y = 5
meshGround.scale.z = 5
meshGround.position.y = -1

const mesh1 = new THREE.Mesh(
    geometry1,
    material
)
const mesh2 = new THREE.Mesh(
    sphereGeometry,
    material
)
mesh2.position.x = -1.5

const mesh3 = new THREE.Mesh(
    torusGeometry,
    material
)
mesh3.position.x = 1.5

// Ambient 环境光
const ambientLight = new THREE.AmbientLight(0xff0000,0.5)
// scene.add(ambientLight)

// 平行光源
const directionalLight = new THREE.DirectionalLight(0x00ff0c,0.3)
directionalLight.position.set(1,0.25,0)
scene.add(directionalLight)

// 环形光源
const hemisphereLight = new THREE.HemisphereLight(0xff0000,0x0000ff,0.3)
scene.add(hemisphereLight)

// 点光源
const pointLight = new THREE.PointLight(0xff9000,0.5,1)
pointLight.position.set(1,-0.5,1)
scene.add(pointLight)

// 矩形光源
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff,2,1,1)
rectAreaLight.position.set(-1.5,0,1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

// 聚光灯光
const spotLight = new THREE.SpotLight(0x78ff00,0.5,7,Math.PI * 0.1,0.25,1)
spotLight.position.set(0,2,3)
spotLight.target.position.x = -0.75
scene.add(spotLight)
scene.add(spotLight.target)

// 性能消耗
// SpotLight RectAreaLight > DirectionalLight PointLight > AmbientLight HemisphereLight

// Helpers
const hemiSpereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight,0.2)
scene.add(hemiSpereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight,0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight,0.2)
scene.add(spotLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper) 


scene.add(meshGround)
scene.add(mesh1)
scene.add(mesh2)
scene.add(mesh3)

const camera = new THREE.PerspectiveCamera(45,size.width / size.height,1,100)
const constrol = new OrbitControls(camera,canvas)
constrol.enableDamping = true
camera.position.z = 3

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(size.width,size.height)
renderer.render(scene,camera)

window.addEventListener('resize',()=> {
    size.width = window.innerWidth,
    size.height = window.innerHeight
    renderer.setSize(size.width,size.height)
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
})

// 旋转
const timer = new THREE.Timer()

const tick = function () {
    timer.update()
    const delta = timer.getDelta()
    mesh1.rotation.x += delta
    mesh2.rotation.x += delta
    mesh3.rotation.x += delta    

    mesh1.rotation.y += delta
    mesh2.rotation.y += delta
    mesh3.rotation.y += delta
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}
tick()