import * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import vertex from './shader/vertex.glsl'
import fragment from './shader/fragment.glsl'
import GUI from 'lil-gui'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}
const gui = new GUI()
const para = {}
para.color = '#ffffff'
const sphereGeo = new THREE.TorusKnotGeometry( 1, 0.4, 100, 16 )
const material = new THREE.RawShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
        uColor: new THREE.Uniform(new THREE.Color(para.color))
    }
})
const mesh = new THREE.Mesh(
    sphereGeo,
    material
)

gui.addColor(para,"color").onFinishChange((col)=>{
    console.log(col)
    material.uniforms.uColor.value = new THREE.Color(col)
})

scene.add(mesh)

const camera = new THREE.PerspectiveCamera(35,size.width / size.height,0.1,100)
const control = new OrbitControls(camera,canvas)
camera.position.z = 6
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(size.width,size.height)
renderer.render(scene,camera)
const tick= function() {
    mesh.rotation.x += 0.002
    control.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}
tick()