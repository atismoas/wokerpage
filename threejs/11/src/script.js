import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as CANNON from 'cannon-es'
import GUI from 'lil-gui'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const size = { 
    width: window.innerWidth,
    height: window.innerHeight
}
// 需要更新的物体
const objectToUpdata = []
const gui = new GUI()
const debugObject = {}
debugObject.createSphere = ()=>{
    createSphere(0.5,{
        x: 0,y: 3,z:0
    })
}
debugObject.createBox = ()=>{
    createBox(
        2,2,2,
        {x: 0,y: 3,z:0})
}
debugObject.reset = ()=> {
    for(const item of objectToUpdata){
        item.body.removeEventListener('collide',playSound)
        world.removeBody(item.body)
        scene.remove(item.mesh)
    }
}
gui.add(debugObject,'createSphere')
gui.add(debugObject,'createBox')
gui.add(debugObject,'reset')

/**
 * Sounds
 */
const hitSound = new Audio('static/sounds/hit.mp3')
const playSound  = (collosion) => {
    // console.log(collosion.contact.getImpactVelocityAlongNormal())
    const impactStrength = collosion.contact.getImpactVelocityAlongNormal()
    if(impactStrength > 1.5){
        hitSound.volume  = Math.random()
        hitSound.currentTime = 0
        hitSound.play()

    }
}


// Axes
const axesHelper = new THREE.AxesHelper()

// Light
const sun = new THREE.PointLight("#ffffff",10)
sun.castShadow = true
sun.position.set(3,3,3)

const ambientLight = new THREE.AmbientLight('#ffffff',2)

// material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.5
material.metalness = 0.7
// material.color = new THREE.Color("#ff0000")


// Plane
const groundGeometry = new THREE.PlaneGeometry(10,10)

// Spere
const sphereGeometry = new THREE.SphereGeometry(0.4,16,32)

// Mesh
const groundMesh = new THREE.Mesh(
    groundGeometry,
    material
)
groundMesh.castShadow = true
groundMesh.receiveShadow = true
groundMesh.rotation.x = - Math.PI * 0.5
const sphere = new THREE.Mesh(
    sphereGeometry,
    material
)
sphere.castShadow = true
sphere.position.y = 0.4

/**
 * Physics
 * World
 */
const world = new CANNON.World()
// 重力常数
world.gravity.set(0,-9.82,0)
// 碰撞检测
world.broadphase = new CANNON.SAPBroadphase(world)
// 允许睡眠，不再检测碰撞
world.allowSleep = true
// Material
const concretNaterial = new CANNON.Material('concrete')
const placticNaterial = new CANNON.Material('plactic')
const defaultMaterial = new CANNON.Material('default')

const concreteplacticContactMaterial = new CANNON.ContactMaterial(
    concretNaterial,placticNaterial,
    {
        // 摩擦系数
        friction: 0.1,
        // 弹跳系数
        restitution: 0.7
    }
)
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        // 摩擦系数
        friction: 0.1,
        // 弹跳系数
        restitution: 0.7
    }
)
world.addContactMaterial(concreteplacticContactMaterial)
// 世界的默认材质
world.defaultContactMaterial = defaultContactMaterial

// Floor 
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: 0,
    material: placticNaterial
})
floorBody.addShape(floorShape)
// 四元数
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1,0,0),
    Math.PI * 0.5
)
world.addBody(floorBody)

// Spere
const sphereShape = new CANNON.Sphere(0.4)
const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0,3,0),
    shape: sphereShape,
    material: concretNaterial
})
// sphereBody.applyLocalForce(new CANNON.Vec3(150,0,0),new CANNON.Vec3(0,0,0))
world.addBody(sphereBody)


const camera = new THREE.PerspectiveCamera(35,size.width / size.height,1,100)
camera.position.z = 6
camera.position.y = 6
camera.rotation.x = Math.PI / 6
const control = new OrbitControls(camera,canvas)


// 
scene.add(camera)
scene.add(groundMesh)
scene.add(sun)
// scene.add(axesHelper)
scene.add(ambientLight)
scene.add(sphere)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.setSize(size.width,size.height)
renderer.render(scene,camera)

/**
 * Utils
 */


const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness:0.4,
    // envMap: environmentTexture
})
const sphereGeo = new THREE.SphereGeometry(1,16,32)

const createSphere = (radius,position) => {
    const mesh = new THREE.Mesh(
        sphereGeo,
        sphereMaterial
    )
    mesh.scale.set(radius,radius,radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // 
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        // 默认位置
        position: new CANNON.Vec3(0,3,0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide',playSound)
    world.addBody(body)

    // Save in object to updata
    objectToUpdata.push({mesh,body})
}

const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness:0.4,
    // envMap: environmentTexture
})
const boxGeo = new THREE.BoxGeometry(1,1,1)

const createBox = (width,height,depth,position) => {
    const mesh = new THREE.Mesh(
        boxGeo,
        boxMaterial
    )
    mesh.scale.set(width,height,depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // 
    const shape = new CANNON.Box(new CANNON.Vec3(width /2,height / 2, depth /2))
    const body = new CANNON.Body({
        mass: 1,
        // 默认位置
        position: new CANNON.Vec3(0,3,0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide',playSound)

    world.addBody(body)

    // Save in object to updata
    objectToUpdata.push({mesh,body})
}
const e = createSphere(0.4,{x: 0,y:4,z: 0})

const timer = new THREE.Timer()

const tick = function () {
    timer.update()
    const delta = timer.getDelta()

    // update physice world

    // wind
    // sphereBody.applyForce(new CANNON.Vec3(-0.5,0,0),sphereBody.position)
    // updata object
    for(const item of objectToUpdata){
        item.mesh.position.copy(item.body.position)
        item.mesh.quaternion.copy(item.body.quaternion)
    }

    world.step(1/ 60,delta,3)
    sphere.position.copy(sphereBody.position)

    // update controls
    control.update()

    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}
tick()