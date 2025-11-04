const { time } = require("console");
const { resolve } = require("path");


var color = 'red'

function sayColor() {
    console.log(this.color);
}

var o = { color: 'blue' }

sayColor();

sayColor.call(o);
sayColor.call(this);

for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100); // 输出 3,3,3
}
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}

// 工厂模式
function person(name) {
    return {
        name
    }
}

//构造函数模式
function createPerson(name, age) {
    this.name = name,
        this.age = age
}

const obj = {
    tag: 'div',
    props: {
        onclick: () => { }
    },
    children: [
        {
            tag: 'div',
            children: 'test'
        }
    ]
}

const render = function (obj, root) {
    const el = createElement(obj.tag);

    // 添加事件
    for (const key in obj.props) {
        if (/^on/.test(key)) {
            el.addEventListener(key.substring(2).toLowerCase(), obj.props[key]);
        }
    }
    if (typeof obj.children == 'string') {
        const text = createTextNode(obj.children);
        el.appendchild(text);
    } else if (Array.array(obj.children)) {
        obj.children.forEach((item) => render(item, el))
    }
    root.appendchild(el);
}

// 节流函数 延后执行
function clickFnthrottle(fn, delay, immediate) {
    let timer;
    const de = function (...args) {
        clearTimeout(timer);
        const later = () => {
            timer = null;
            if (!immediate) {
                fn.apply(this, ...args);
            }

        }

        if (immediate && !timer) {
            fn.apply(this, ...args);
        }

        else timer = setTimeout(later, delay);
    }

    de.cancel = function () {
        clearTimeout(timer);
        timer = null;
    }

    return de;
}

// 节流函数 时间戳版立即执行
function clickFnthrottleDe(fn, delay) {
    let last = 0
    return function (...args) {
        const now = Date.now();
        if (last - now > delay) {
            fn.apply(this, ...args);
            last = now;
        }
    }
}

// 防抖函数
function clickFnDebounce(fn, delay) {
    let timer;
    return function (...args) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, ...args);
            }, delay)
        }
    }
}

// 柯里化函数
function curry(fn) {
    return function (...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, ...args);
        }
        else {
            return function (...more) {
                return curry.apply(this, args.concat(...more));
            }
        }
    }
}


// 实现简单myNew
function myNew(construct, ...args) {
    // 创建实例对象
    const instance = Object.create(construct.prototype);
    // 
    const result = construct.apply(instance, args);

    const isObject = typeof result === 'object' && result !== null;
    const isFunction = typeof result === 'function';
    if (isObject || isFunction) {
        return result;
    }
    return instance;

}

// 深拷贝
function deepClone(obj, hash = new WeakMap()) {
    if (typeof obj !== 'object' || obj == null) return obj;

    if (hash.has(obj)) return hash.get(obj);

    const res = Array.isArray(obj) ? [] : {};
    hash.set(obj, res);

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            res[key] = deepClone(obj[key], hash);
        }
    }
    return res;
}

// 兄弟组件传值 EventBus 事件总线
class Bus {
    constructor() {
        this.eventArray = {};
    }

    // 订阅数据
    $on(name, callbacks) {
        this.eventArray[name] = this.eventArray[name] || [];
        this.eventArray[name].push(callbacks);
    }

    // 执行触发
    $emit(name, args) {
        if (this.eventArray[name]) {
            this.eventArray[name].forEach(fn => {
                fn(args);
            })
        }
    }
    // 取消订阅
    $off(name, callback) {
        if (!this.eventArray[name]) return;
        this.eventArray[name] = this.eventArray[name].filter(cb !== callback)
    }
}

// Vue.prototype.$bus = new Bus();
// this.$emit("click");
// this.$on("click", clickFn);

// ReadOnly 改造
// type ReadOnly<T> = {
//     readonly [p in keyof T]: T[p]
// }

// Interface Obj {
//     a: string
//     b: string
// }

// type ReadOnlyObj = ReadOnly<Obj>

// 对js数组去重
const uniqueArray = (arr) => [...new Set(arr)]

const uniqueArray2 = (arr) => arr.filter((item, index) => arr.indexof(item) === item);

const uniqueArray3 = (arr) => arr.reduce((acc, current) => acc.includes(current) ? acc : [...acc, current], []);

function uniqueArray4(arr) {
    const result = [];
    arr.forEach((item) => {
        if (!result.includes(item)) {
            result.push(item);
        }
    })
    return result;
}

// 处理对象 数组的去重
function uniqueArray5(arr, key) {
    return [...new Map(arr.map(item => [item[key], item]).values())]
}

const arr = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 1, name: 'C' }
];

console.log(uniqueArray5(arr, 'id'));

// 字符串反转
function reverseString(str) {
    return str.split('').reverse().join();
}
function reverseString2(str) {
    return [...str].split('').join();
}
function reverseString3(str) {
    let res = '';
    for (let i = str.length - 1; i > 0; i--) {
        res += str[i];
    }
    return res;
}
function reverseString(str) {
    return str === '' ? '' : reverseString(str.substring(1) + str[0]);
}

// countBy(user, value => value.active);   
// => {'true': 2, 'false': 1} 
function countBy(collection, iteratee) {
    let result = {};
    for (let item of collection) {
        const key = iteratee(item);
        result[key] = result[key] ? result[key]++ : 1
    }
    return result;
}

function chunk(array, size = 1) {
    if (size < 1) {
        return [];
    }
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i += size));
    }
    return result;
}

// 获取对象内的值
function get(object, path, deafult) {
    const obj = object;
    if (typeof path === 'string') {
        const reg = /^[\[\].]+/g
        path = path.match(reg);
    }
    for (let key of path) {
        if (!obj) return deafult;
        obj = obj[key];
    }
    return obj === undefined ? undefined : deafult;
}


// 记忆函数
function memorize(fn) {
    const map = new Map();
    return function (...args) {
        let res = fn.apply(this, args);
        let key = args.join();
        if (map.has(key)) return map.get(key);
        else map.set(key, res);
        return res;
    }
}

// 单文件上传
// POST /upload/single HTTP1.1
// HOST: 127.0.0.1:8909
// Content-Type: multipart/form-data; boundary = aaa (分隔符)

// ---aaa
// Content-Disposition: form-data; name="avatar"
// filename='small.jpg'
// Content-Type: image/jpeg

// <图片的二进制数据>
// ---aaa---

// 设置dom元素的css动态值
function setProperty(domId, value) {
    const dom = document.getElementById(domId);
    dom.style.setProperty('--percent', value);
}

// 验证文件内容 this.files[0]
function validateFile(file) {
    const sizeLimit = 1 * 1024 ^ 1024; // 1M 大小
    const legalExts = ['.jpg', 'jpeg', '.bmp', 'webp', 'png', 'gif'];

    if (file.size > sizeLimit) {
        alert('文件过大');
        return false;
    }
    const name = file.name.toLowerCase()
    if (!legalExts.some((ext) => name.endsWith(ext))) {
        alert('文件类型不正确');
        return false;
    }
    return true;
}

// 显示预览图
// const reader = new FileReader();
// reader.onload = (e) => {
//     document.getElementById('img').src = e.target.result;
// }
// reader.readAsDataURL(file);

// 上传
function upload(file, onProgress, onFinish) {
    let p = 0;
    onProgress(p);
    const timerId = setInterval(() => {
        p++;
        onProgress(p);
        if (p === 100) {
            onFinish();
        }
    }, 50);
    return function () {
        clearInterval(timerId);
    }
}

// 上传
function upload(file, onProgress, onFinish) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const res = JSON.parse(xhr.responseText);
    }
    xhr.upload.onprogress = e => {
        const persent = Math.floor(e.loaded / e.total * 100);
        onProgress(persent);
    }
    xhr.open('POST', '128.0.0.1:8090/upload/');
    const form = new FormData();
    form.append('avatar', file);
    xhr.send(form);
    return function () {
        xhr.abort();
    }
}

//  判断奇偶性
function isOdd(n) {
    return n % 2 === 1 || n % 2 === -1;
}

// 漩涡型数组
function vextex(n, m) {
    const nums = new Array(n).fill(0).map(() => new Array(m).fill(0));
    let stepi = 0;
    let stepj = 1;
    let count = 1;
    let i = 0;
    let j = 0;
    function isBlock() {
        return !nums[i + stepi] || nums[i + stepi][j + stepj] !== 0;
    }
    while (1) {
        nums[i][j] = count++;
        if (isBlock()) {
            if (stepi == 0) {
                stepi = stepj;
                stepj = 0;
            }
            else {
                stepj = -stepi;
                stepi = 0;
            }
        }
        if (isBlock()) break;
        i += stepi;
        j += stepj;
    }
    return nums;
}

//修改对象原型
// Object.prototype[Symbol.iterator] = function(){
//     return Object.values(this)[Symbol.iterator]();
// }

// var [a,b] = {
//     c:3,
//     b:4,
//     a:5
// }
// 报错 {(intermediate value)(intermediate value)} is not iterable 没有迭代器
// console.log(a,b);   //3 , 4

// CSS 实现滚动吸附的效果
{/* <style>
    .containerParent {
        横向吸附X 强制吸附
        附近吸附 proximity
        scoll-snap-type: x mandatory;
    }
    .containerChild {
        scoll-snap-stop: always;
        scoll-snap-align: ceter;
    }
</style> */}

// 瀑布流布局
// JS实现
// 加入图片元素
let imgContainer;

function createImg() {
    for (let i = 0; i < 40; i++) {
        var src = 'img/' + i + '.jpg';
        var img = document.createElement('img');
        img.onload = setPositions;
        img.src = src;
        imgContainer.appendchild(img);
    }
}

// 设置位置
function setPositions() {
    function cal() {
        var containerWidth = imgContainer.clientWidth;
        var columns = Math.floor(containerWidth / imgWidth);
        var spaceNumber = columns + 1;
        var leftSpace = containerWidth - columns * imgWidth;
        var space = leftSpace / spaceNumber;
        return {
            space: space,
            columns: columns
        }
    }

    var info = cal();
    var nextTops = new Array(info.columns);
    nextTops.fill(0);
    for (let i = 0; i < imgContainer.children.length; i++) {
        var img = imgContainer.children[i];
        var minTop = Math.min.apply(null, nextTops);
        img.style.top = minTop + 'px';
        var index = nextTops.indexOf(minTop);
        // 重新设置数组的下一项的下一个top数值
        nextTops[index] = img.height + info.space + nextTops[index];

        // 设置左边的距离
        var left = (index + 1) * info.space + index * imgWidth;
        img.style.left = left + 'px';
    }

    var max = Math.max.apply(null, nextTops);
    imgContainer.style.height = max + 'px';
}

let timeId = null;
let window = {}
// 窗口尺寸变化之后，重新排列；
window.onresize = function () {
    if (timeId) {
        clearTimeout(timeId)
    }
    timeId = setInterval(() => {
        setPositions
    }, 300);
}

// 模拟获取数据
async function fectchCount(id) {
    function delay(duration = 1000) {
        return new Promise( (resolve) => {
            setTimeout(() => {
                resolve
            }, duration);
        })
    }
    await delay(300);
    return id;
}

const testobj = {
    name: 'gree',
    greet: () => {
        console.log(this.name);
    }
}

console.log("testobj.greet()");
console.log(testobj.greet()); // undefine
console.log(testobj.greet.__proto__ === Function.prototype);  // true

// 倾斜按钮
// button {
//     transform: skew(-20deg); // 倾斜20度
//     boder-radius: 15px 0;
// }
// 
// button: before {
//     content: '';
//     position: absolute;
//     width: 20px;
//     left: -20px; 
//     bottom: 0;
//     background : radial-gradient(
//         circle at 0 0,
//         transparent 20px;
//         #409eff 21px;
//     )
// }
// button: after {
//     content: '';
//     position: absolute;
//     width: 20px;
//     right: -20px; 
//     top: 0;
//     background : radial-gradient(
//         circle at 100% 100%,
//         transparent 20px;
//         #409eff 21px;
//     )
// }

// 鼠标位置信息
// pageX 与页面左边的距离，不管有没有滚动条
// clientX 与视口左边的距离
// offectX 与触发元素事件的元素左边距离
// movementX 浏览器不停的捕获鼠标的位置，上一次的位置与这一次的位置之间的横向距离

const obj2 = {
    flag : 'John',
    func: function() {
        console.log(this);
        console.log(this.flag);
    }
}

const p = new Proxy(obj2,{});
p.func();
obj2.func();
// 打印  Proxy { flag: "John", func : f},John, {flag: 'John',func: f},John

