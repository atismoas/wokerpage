import * as THREE from 'three'
import { OrbitControls} from "three/addons/controls/OrbitControls.js"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const size = { 
    width: window.innerWidth,
    height: window.innerHeight
}
let model = null
const gltfLoader = new GLTFLoader()
gltfLoader.load('models/Duck/glTF-Binary/Duck.glb',(gltf)=>{
    model = gltf.scene
    gltf.scene.position.y = -1.2
    scene.add(gltf.scene)
})
const mouse = new THREE.Vector2()
window.addEventListener('mousemove',(event)=> {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
})
let currentIntersect = null
window.addEventListener('click',(event) =>{
    if(currentIntersect) {

    }
})


// mesh
const sphereGeo = new THREE.SphereGeometry(0.4,16,16)
// 如果共用了一个material，会导致所有的图案颜色一起变化，这是一个引用
const material = new THREE.MeshStandardMaterial({
    color: '#ff0000'
})

const object1 = new THREE.Mesh(
    sphereGeo,
    new THREE.MeshStandardMaterial({
    color: '#ff0000'
})
)
object1.position.x = -1.5
const object2 = new THREE.Mesh(
    sphereGeo,
    new THREE.MeshStandardMaterial({
    color: '#ff0000'
})
)
object2.position.x = 1.5
const object3 = new THREE.Mesh(
    sphereGeo,
    new THREE.MeshStandardMaterial({
    color: '#ff0000'
})
)
scene.add(object1,object2,object3)

// Raycaster
const rayCaster = new THREE.Raycaster()



// rayCaster.set(rayOrigin,rayDirction)

// const intersect = rayCaster.intersectObjects([object2])
// console.log(intersect)

// const intersects = rayCaster.intersectObjects([object1,object2,object3])
// console.log(intersects)


const ambientLight = new THREE.AmbientLight('#ffffff',1)

const camera = new THREE.PerspectiveCamera(35,size.width / size.height,1, 100)
camera.position.z = 6
const control = new OrbitControls(camera,canvas)
scene.add(camera)

scene.add(ambientLight)
const renderer  = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(size.width,size.height)
renderer.render(scene,camera)
const objectToTest = [object1,object2,object3]
const timer = new THREE.Timer()
const tick = function() {
    timer.update()
    const elapsed = timer.getElapsed()
    object1.position.y = Math.sin(elapsed * Math.PI * 0.1 )
    object2.position.y = Math.sin(elapsed * Math.PI * 0.3) 
    object3.position.y = Math.sin(elapsed * Math.PI * 0.4) 

    // const rayOrigin = new THREE.Vector3(-3,0,0)
    // const rayDirction = new THREE.Vector3(1,0,0)
    // rayDirction.normalize()
    
    // rayCaster.set(rayOrigin,rayDirction)
    // const intersects = rayCaster.intersectObjects(objectToTest)
    // for(const item of objectToTest){
    //     item.material.color = new THREE.Color('#ff0000')
        
    // }
    // for(const item of intersects){
    //     item.object.material.color = new THREE.Color('#0000ff')
    // }
    rayCaster.setFromCamera(mouse,camera)

    const intersects = rayCaster.intersectObjects(objectToTest)
    for(const item of objectToTest){
        item.material.color = new THREE.Color('#ff0000')
        
    }
    for(const item of intersects){
        item.object.material.color = new THREE.Color('#0000ff')
    }

    if(intersects.length){
        if(currentIntersect == null) {
            // console.log("mouse enter")
        }
        currentIntersect = intersects[0]
    }
    else{
        if(currentIntersect){
            // console.log('mouse left')
        }
        currentIntersect = null
    }
    if(model) {
        const intersect = rayCaster.intersectObject(model)
        // console.log(intersect)
    }

    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}
tick()