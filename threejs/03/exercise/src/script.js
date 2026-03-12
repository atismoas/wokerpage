import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'


/**
 * Debug
 */
const gui = new GUI({
    width: 300,
    title: 'nice GUI',
    closeFolders:false
})
gui.close()
gui.hide()

const debugObject = {}
debugObject.color = '#8553b7'

/**
 * Textures
 */
// const img = new Image()
// const texture = new THREE.Texture(img)
// img.onload = () => {
//     console.log('img onload')
//     texture.needsUpdate =true
// }
// img.src = 'src/textures/Glass.jpg'

// 
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
    console.log("onStart")
}
loadingManager.onLoad = () => {
    console.log("onLoad")
}
loadingManager.onProgress = () => {
    console.log("onProgress")
}
loadingManager.onError = () => {
    console.log("onError")
}


const textureLoad = new THREE.TextureLoader(loadingManager)
const texture = textureLoad.load('src/textures/Glass.jpg'
    // ,() => {
    //     console.log("load")
    // },
    // () => {
    //     console.log("progress")
    // },
    // () => {
    //     console.log("error")
    // },
)

// repeat
// texture.repeat.x = 2
// texture.repeat.y = 3

// texture.wrapS = THREE.MirroredRepeatWrapping
// texture.wrapT = THREE.MirroredRepeatWrapping


// texture.offset.x = 0.5
// texture.offset.y = 0.5

texture.center.x = 0.5
texture.center.y = 0.5
texture.rotation = Math.PI * 0.25

texture.minFilter = THREE.NearestFilter


const scene = new THREE.Scene()
const canvas = document.querySelector('canvas.webgl')
// Sizes
const size = {
    // width: 800,
    // height: 800
    width: window.innerWidth,
    height: window.innerHeight
}

// curor 归一化指针位置
const cursor = {
    x: 0,
    y: 0
}

console.log(THREE.REVISION)

const geometry = new THREE.BoxGeometry(1,1,1,)


// 创建空几何体
// const geometry = new THREE.BufferGeometry()
// const count = 500
// const positionArray = new Float32Array(count * 3 * 3)
// for(let i =0;i<count;i++){
//     positionArray[i] = Math.random() - 0.5

// }
// const positionAttribute = new THREE.BufferAttribute(positionArray,3)
// geometry.setAttribute('position',positionAttribute)


const material = new THREE.MeshBasicMaterial({ 
    map: texture,
    // color: debugObject.color,
    // wireframe:true
})
const mesh = new THREE.Mesh(geometry,material)
const group = new THREE.Group()

// Group 组
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0xfff000})
)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0x555555})
)
cube2.position.x = 2
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0x666666})
)
cube3.position.x = 3

group.add(cube1,cube2 ,cube3)
group.position.y = 1
//group.scale.set(1,1.1,1)


// position  位置
// mesh.position.x = 2
// mesh.position.y = 1
// mesh.position.z = 3
//mesh.position.set(1,2,3)


// Scale 放缩
// mesh.scale.x = 0.5
// mesh.scale.y = 0.5
// mesh.scale.z = 1.5
//mesh.scale.set(0.5,0.7,1.5)

// Ratation
mesh.rotation.reorder('XYZ') // 先旋转X 后Y Z
mesh.rotation.x = Math.PI // 旋转180°

const cubeTweaks = gui.addFolder('Awesome cube')
cubeTweaks.close()

debugObject.spin = () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI *2})
}
debugObject.subDivision = 2

cubeTweaks.add(mesh.position,'y').max(3).min(-3).step(0.01).name('高度')
cubeTweaks.add(mesh,'visible')
cubeTweaks.add(material,'wireframe')
cubeTweaks.addColor(material,'color').onChange((value)=> {
    //console.log(value.getHexString())
})
cubeTweaks.addColor(debugObject,'color').onChange((value)=> {
    material.color.set(debugObject.color)
}).name('debugcolor')
cubeTweaks.add(debugObject, 'spin')
cubeTweaks.add(debugObject,'subDivision').min(1).max(20).step(1).onFinishChange(()=> {
    mesh.geometry.dispose()
    mesh.geometry = new THREE.BoxGeometry(
        1,1,1,
        debugObject.subDivision,
        debugObject.subDivision,
        debugObject.subDivision
    )
})

// Axes helper 坐标辅助器
const axesHelper = new THREE.AxesHelper()

// Camera
const camera = new THREE.PerspectiveCamera(45, size.width / size.height)

camera.position.z = 3


// OribitControl  轨道控制器
const control = new OrbitControls(camera,canvas)
//control.target.y = 1
//control.update()
// 阻尼 摩擦
control.enableDamping = true

// look at  聚焦
//camera.lookAt(mesh.position)

window.addEventListener('mousemove', (e)=>{
    cursor.x =  - (e.clientX / size.width - 0.5),
    cursor.y =   (e.clientY / size.height - 0.5 )    
})
window.addEventListener("resize", (e)=> {
    console.log(size)
    // 此刻更新并不会立即生效
    size.width = window.innerWidth,
    size.height = window.innerHeight

    // update camera.aspect
    // 更新相机的宽高比
    camera.aspect = size.width / size.height
    // 更新投影矩阵
    camera.updateProjectionMatrix()
    // 更新renderer
    renderer.setSize(size.width,size.height)
})

window.addEventListener('dblclick',() => {
    const fullScreen = document.fullscreenElement || document.webkitfullscreenElement
    if(!fullScreen){
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequstFullscreen){
            canvas.webkitRequstFullscreen()
        }
    }
    else{
        if(document.exitFullscreen){
            document.exitFullscreen()
        }
        else {
            document.webkitExitFullscreen()
        }
    }
})

window.addEventListener('keydown', (e)=>{
    if(e.key== 'h'){
        gui.show(gui._hidden)
    }

})

// Animation 动画
const tick = () => {
    // 具体操作
    //mesh.position.x += 0.01
    //mesh.position.y += 0.01

    //mesh.rotation.y += 0.01
    // camera.position.x = cursor.x *3
    // camera.position.y = cursor.y *3

    // update Camera
    // 旋转相机聚焦一个物体
    // camera.position.x = Math.cos(cursor.x * Math.PI *2) *3
    // camera.position.z = Math.sin(cursor.x * Math.PI *2)*3
    // camera.y = cursor.y * 15
    // camera.lookAt(mesh.position)


    // 如果你用了阻尼，别忘了在每一帧更新控制器
    control.update()

    // Render
    renderer.render(scene,camera)
    //console.log("the animation is begining")
    window.requestAnimationFrame(tick)
}




scene.add(mesh)
scene.add(camera)
scene.add(axesHelper)
//scene.add(group)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(size.width,size.height)
renderer.render(scene,camera)
// 像素比
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
tick()



