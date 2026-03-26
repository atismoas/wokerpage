import * as THREE from 'three'
import { OrbitControls} from 'three/addons/controls/OrbitControls.js'
import gsap from 'gsap'
import vertex from './shader/vertex.glsl'
import fragment from './shader/fragment.glsl'

const canvas = document.querySelector('canvas.webgl')
const axesHelper = new THREE.AxesHelper()
const scene = new THREE.Scene()
const size = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio,2)
}
size.resolution = new THREE.Vector2(size.width * size.pixelRatio,size.height  * size.pixelRatio)
const camera = new THREE.PerspectiveCamera(35, size.width / size.height ,0.1, 100)
camera.position.z = 6
const controls = new OrbitControls(camera,canvas)

// Textures
const textureLoader = new THREE.TextureLoader()
const textures = [
   textureLoader.load('src/particles/1.png'),
   textureLoader.load('src/particles/2.png'),
   textureLoader.load('src/particles/3.png'),
   textureLoader.load('src/particles/4.png'),
   textureLoader.load('src/particles/5.png'),
   textureLoader.load('src/particles/6.png'),
   textureLoader.load('src/particles/7.png'),
   textureLoader.load('src/particles/8.png')
]


// Geometry 
const createFirework = function(count,position,pointSize,texture,radius,color) {
    const points = new THREE.BufferGeometry()
    const pointsArr = new Float32Array(count * 3)
    const sizeArr = new Float32Array(count)
    const timeArr = new Float32Array(count)
    for(let i=0;i<count;i++) {
        const spherePosition = new THREE.Spherical(
            radius * (Math.random() * 0.25 + 0.75),
            Math.random() * Math.PI,
            Math.random() * Math.PI * 2,
        )
        const sphere = new THREE.Vector3()
        sphere.setFromSpherical(spherePosition)

        pointsArr[i*3] = sphere.x
        pointsArr[i*3 + 1] = sphere.y
        pointsArr[i*3 + 2] = sphere.z

        sizeArr[i] = Math.random()
        timeArr[i] = Math.random() + 1
    }
    points.setAttribute('position', new THREE.BufferAttribute(pointsArr,3))
    points.setAttribute('uPointSize', new THREE.BufferAttribute(sizeArr,1))
    points.setAttribute('uTimeMutiply', new THREE.BufferAttribute(sizeArr,1))
    texture.flipY = false
    const material = new THREE.RawShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent : true,
        uniforms: {
            uSize: { value: pointSize},
            uResolution: { value: size.resolution},
            uTextures: {value: texture},
            uProgress: { value: 0},
            uColor: {value: new THREE.Color(color)}
        }
    })
    const fireWork = new THREE.Points(
        points,
        material
    )
    fireWork.position.copy(position)
    scene.add(fireWork)

    const destory = () => {
        scene.remove(fireWork)
        points.dispose()
        material.dispose()
        console.log("destory")
    }

    // Animate
    gsap.to(
        material.uniforms.uProgress,
        { value: 1, ease: "linear",duration: 3, onComplete: destory}
    )
}

const createRandomFireWork = function(){
    createFirework(
        Math.round(Math.random() * 1000 + 400),
        new THREE.Vector3(
            Math.random(),
            Math.random() + 0.5,
            Math.random()
        ),
        Math.random() * 10 + 5,
        textures[Math.floor(Math.random() * textures.length)],
        Math.random() + 0.5 ,
        new THREE.Color().setHSL(Math.random(),1,0.7)
    )
}

createFirework(1000,new THREE.Vector3(1.0),5,textures[7], 2, '#8affff')

scene.add(axesHelper)
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(size.width,size.height)
renderer.render(scene,camera)

window.addEventListener('click', () => {
    createRandomFireWork()
})

window.addEventListener('resize',()=>{
    size.width = window.innerWidth
    size.height = window.innerHeight
    size.pixelRatio = Math.min(window.devicePixelRatio,2)
    size.resolution.set(size.width * size.pixelRatio,size.height  * size.pixelRatio)
    

    // update camera
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()

    // render
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(size.pixelRatio)
})

const timer = new THREE.Timer()

const tick = function() {
    // update time
    timer.update()

    controls.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}
tick()