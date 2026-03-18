import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'


const gui = new GUI()
const parameters = {
    mainColor: '#ffeded'
}

const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

const axesHelper = new THREE.AxesHelper()


const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load(
    '/gradients/3.jpg'
)
texture.magFilter = THREE.NearestFilter
texture.minFilter = THREE.NearestFilter
console.log(texture)

const directionLight = new THREE.DirectionalLight('#ffffff',1)
directionLight.position.set(1,1,0)

const material = new THREE.MeshToonMaterial({
    gradientMap: texture,  
    color: parameters.mainColor
})

const distance = 4
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1,0.4,60),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1,2,32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8,0.35,16),
    material
)
mesh1.position.y = - distance * 0
mesh2.position.y = - distance * 1 
mesh3.position.y = - distance * 2

mesh1.position.x = 1
mesh2.position.x = -1
mesh3.position.x = 1

const sectionMesh = [mesh1,mesh2,mesh3]
let currentSection = 0 

// Particles
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for(let i =0;i< particlesCount;i++ ){
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] =  distance * 0.5 - Math.random() * 5 * distance * sectionMesh.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}
console.log(positions)

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3))

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.mainColor,
    sizeAttenuation: true,
    size: 0.03
})

const particles = new THREE.Points(
    particlesGeometry,
    particlesMaterial
)
// Scroll
let scrollY = window.scrollY

window.addEventListener('scroll',() =>{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / size.height)
    if(newSection !== currentSection){
        currentSection = newSection
        gsap.to(
            sectionMesh[currentSection].rotation,
            {
                duration: 1.5,
                ease: "power2.inOut",
                x: '+=6',
                y: "+=3"
            }
        )
    }
})

window.addEventListener('resize',() => {
    size.width = window.innerWidth
    size.height = window.innerHeight
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
    renderer.setSize(size.width,size.height)
    renderer.render(scene,camera)
})

const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove',(e)=>{
    cursor.x = e.clientX / size.width - 0.5
    cursor.y = e.clientY / size.height - 0.5
})

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

const cameraGroup = new THREE.Group()
const camera = new THREE.PerspectiveCamera(35, size.width / size.height,1 ,100)
camera.position.z = 6
cameraGroup.add(camera)

gui.addColor(parameters,"mainColor").onFinishChange(() => {
    material.color.set(parameters.mainColor)
    particlesMaterial.color.set(parameters.mainColor)
    renderer.render(scene,camera)
})

scene.add(directionLight)
scene.add(mesh1,mesh2,mesh3)
// scene.add(axesHelper)
scene.add(cameraGroup)
scene.add(particles)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // 背景透明度（0 - 1）
    alpha: true
})
renderer.setSize(size.width,size.height)
renderer.setClearColor('#1e1a20')
renderer.render(scene,camera)

const timer = new THREE.Timer()
const tick = function() {
    timer.update()
    const deltaTime = timer.getDelta()
    // Animate camera
    camera.position.y = - scrollY / size.height * distance

    const parallaxX = cursor.x
    const parallaxY = - cursor.y
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    const elapsed = timer.getElapsed()
    for(const mesh of sectionMesh) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.1
    }
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}

tick()
