import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import typeFaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
const size = {
    width: window.innerWidth,
    height: window.innerHeight 
}
const axedHelper = new THREE.AxesHelper()
const canvas = document.querySelector('canvas.webgl')
const material = new THREE.MeshBasicMaterial({color: "#20e662"})
const geometry = new THREE.BoxGeometry(1,1,1)
const mesh = new THREE.Mesh(
    geometry,
    material
)

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load(
    'src/textures/1.jpg'
)

const fontLoader = new FontLoader()
fontLoader.load(
    'src/font/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'THREE-JS',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                depth: 0.1,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3
            }
        )
        const textMateial = new THREE.MeshBasicMaterial({
            map: texture
        })
        textMateial.wireframe = true
        const text = new THREE.Mesh(
            textGeometry,
            textMateial
        )
        textGeometry.center()
        scene.add(text)
        console.time("test")
        const torusGeometry = new THREE.TorusGeometry( 0.3, 0.2, 20, 45 )
        const material = new THREE.MeshMatcapMaterial(
            {
                matcap: texture
            }
        )
        const group = new THREE.Group()
        for(let i =0;i< 1000;i++){
            const mesh = new THREE.Mesh(
                torusGeometry,
                material
            )
            mesh.position.x = (Math.random() - 0.5) * 50
            mesh.position.y = (Math.random() - 0.5) * 50
            mesh.position.z = (Math.random() - 0.5) * 50
            mesh.rotation.x = Math.random() * Math.PI
            mesh.rotation.y = Math.random() * Math.PI
            mesh.rotation.z = Math.random() * Math.PI
            const scale = Math.random()
            mesh.scale.set(scale,scale,scale)
            group.add(mesh)
        }
        scene.add(group)
        console.timeEnd('test')

        console.log('font loaded')
    }
)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45,size.width / size.height)
const control = new OrbitControls(camera,canvas)
camera.position.z =3

//scene.add(mesh)
scene.add(camera)
scene.add(axedHelper)

const tick = function ( ){
    control.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}

window.addEventListener('resize', ()=> {
    size.width = window.innerWidth
    size.height = window.innerHeight
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
    renderer.setSize(size.width,size.height)
})

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(size.width,size.height)
renderer.render(scene,camera)

tick()