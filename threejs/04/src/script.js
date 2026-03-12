import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'

const canvas = document.querySelector('canvas.webgl')
const axesHelper = new THREE.AxesHelper()
const gui = new GUI()

const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()
const textureload = new THREE.TextureLoader(loadingManager)
const stoneTexture = textureload.load('/src/textures/1.jpg')
const wallTexture = textureload.load('/src/textures/2.jpg')
const groundTexture = textureload.load('/src/textures/3.jpg')

/**
 * Enviroment map
 */
const hdrLoader = new HDRLoader()
const enviromentMap = hdrLoader.load('/src/textures/HDR/rogland_clear_night_1k.hdr',function(e) {
    console.log(e)
    console.log(e === enviromentMap? "1": "0")
    // 不能写在外面
    e.mapping = THREE.EquirectangularReflectionMapping
})

// 网格基础材质
// const material = new THREE.MeshBasicMaterial({
//     // map: stoneTexture,
//     // color: "#20e662"
// })

// material.side = THREE.DoubleSide
// material.color = new THREE.Color(0xff000)
// 网格
// material.wireframe = true
// 透明度
// material.transparent  = true
// material.opacity  = 0.5

/**
 * 透明度贴图 
 * 纹理是白色时可见，黑色时隐藏
 */
// material.alphaMap = stoneTexture


// 用模型的法线方向生成颜色的调试材质
// 不需要光源
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// matcap 模拟光源材质
// 相对与摄像机的朝向，选取相对应的颜色
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = stoneTexture


// 网格深度材质
// 靠近摄影机时变白，远离变暗
// const material = new THREE.MeshDepthMaterial()

// 网格兰伯特材质
// 需要光源
// const material = new THREE.MeshLambertMaterial()

// 网格冯氏材质
// const material = new THREE.MeshPhongMaterial()
// 控制光泽度
// material.shininess = 100
// 光反射颜色
// material.specular = new THREE.Color(0x1188ff)

// // 网格卡通材质
// const material = new THREE.MeshToonMaterial()
// // 渐变贴图
// material.gradientMap = stoneTexture
// stoneTexture.minFilter = THREE.NearestFilter
// stoneTexture.magFilter = THREE.NearestFilter
// // 禁用MIP映射
// stoneTexture.generateMipmaps = false

// 网格标准材质 PBR渲染
// 使用真实的参数得到相似的结果
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0.45
// material.roughness = 0.65
// // 环境光遮蔽纹理 在黑暗的地方产生纹理
// material.aoMap  = stoneTexture
// // ao贴图强度
// material.aoMapIntensity = 1 
// // 浮雕
// material.displacementMap = stoneTexture
// // 强度
// material.displacementScale = 0.2
// // 粗糙度纹理 最终的结果是 metalness 与之相乘 可以将metalness设置为1
// material.metalnessMap = stoneTexture
// material.roughnessMap = stoneTexture
// // 法线贴图
// material.normalMap = stoneTexture
// material.normalScale.set(0.5,0.5)
// material.transparent = true
// // 透明度贴图
// material.alphaMap = stoneTexture
// // material.envMap = enviromentMap

// gui.add(material,'metalness').min(0).max(1).step(0.01)
// gui.add(material,'roughness').min(0).max(1).step(0.01)

// 物理纹理
const material = new THREE.MeshPhysicalMaterial()
// // material.metalness = 0.45
// // material.roughness = 0.65
// // 环境光遮蔽纹理 在黑暗的地方产生纹理
// material.aoMap  = stoneTexture
// // ao贴图强度
// material.aoMapIntensity = 1 
// // 浮雕
// material.displacementMap = stoneTexture
// // 强度
// material.displacementScale = 0.2
// // 粗糙度纹理 最终的结果是 metalness 与之相乘 可以将metalness设置为1
// material.metalnessMap = stoneTexture
// material.roughnessMap = stoneTexture
// // 法线贴图
// material.normalMap = stoneTexture
// material.normalScale.set(0.5,0.5)
// material.transparent = true
// // 透明度贴图
// material.alphaMap = stoneTexture
// material.envMap = enviromentMap

gui.add(material,'metalness').min(0).max(1).step(0.01)
gui.add(material,'roughness').min(0).max(1).step(0.01)

// 清漆层
material.clearcoat = 1
material.clearcoatRoughness = 0

gui.add(material,'clearcoat').min(0).max(1).step(0.01)
gui.add(material,'clearcoatRoughness').min(0).max(1).step(0.01)

// sheen 织物纹理
// material.sheen = 1
// material.sheenRoughness = 0.25
// material.sheenColor.set(1,1,1)

// gui.add(material,'sheen').min(0).max(1).step(0.01)
// gui.add(material,'sheenRoughness').min(0).max(1).step(0.01)
// gui.addColor(material,'sheenColor')

// 彩虹色效应 气泡 碟片
material.iridescence = 1
material.iridescenceIOR = 1
material.iridescenceThicknessRange = [100,800]

gui.add(material,'iridescence').min(0).max(1).step(0.01)
gui.add(material,'iridescenceIOR').min(1).max(2.3333).step(0.01)
gui.add(material.iridescenceThicknessRange,'0').min(1).max(1000).step(0.01)
gui.add(material.iridescenceThicknessRange,'1').min(1).max(1000).step(0.01)

// 透射
material.transmission = 1
// 折射率
material.ior = 1.5
// 厚度
material.thickness = 0.5

gui.add(material,'transmission').min(0).max(1).step(0.01)
gui.add(material,'ior').min(1).max(10).step(0.01)
gui.add(material,'thickness').min(0).max(1).step(0.01)


/**
 * Light
 * ambientLight 环境光
 */
const ambientLight = new THREE.AmbientLight(0x000000,1)

// 点光源
const pointLight = new THREE.PointLight(0xffffff,30)
pointLight.position.x = 3
pointLight.position.y = 3
pointLight.position.z = 3


// 几何图形
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,16,16),
    material
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    material
)
plane.position.x = 0
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3,0.2,16,32),
    material
)
torus.position.x = 1.5


// 相机与轨道控制器
const camera = new THREE.PerspectiveCamera(75,size.width / size.height,1,100)
const control = new OrbitControls(camera,canvas)
control.enableDamping = true
camera.position.z = 3


// 场景与添加
const scene = new THREE.Scene()

scene.add(sphere,plane,torus)
scene.add(axesHelper)
scene.add(ambientLight)
scene.add(camera)

// scene.add(ambientLight)
// scene.add(pointLight)


// listen the window change
window.addEventListener("resize",(e) =>{
    size.width = window.innerWidth
    size.height = window.innerHeight
    camera.aspect = size.width / size.height 
    camera.updateProjectionMatrix()
    renderer.setSize(size.width,size.height)
})

const timer = new THREE.Timer()

// Animation
const tick = function() {
    // 此方法应在每次仿真之前调用一次
    timer.update()
    const delta = timer.getDelta()
    // update Object
    sphere.rotation.y += delta
    plane.rotation.y += delta
    torus.rotation.y +=  delta

    control.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}

// 第一次挂载与渲染
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

scene.environment = enviromentMap
scene.background = enviromentMap

renderer.setSize(size.width,size.height)

renderer.render(scene,camera)
// 触发第一次动画
tick()
