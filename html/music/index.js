console.log(data)

const dom = {
    audio: document.querySelector('audio'),
    ul : document.querySelector('ul')
}

const dataArray = data.split('\n')
console.log(dataArray)
const dataObj = parseStr(dataArray);

function findIndex() {
    const currentTime = dom.audio.currentTime;
    for(let i = 0; i< dataObj.length; i++ )
    {
        if(currentTime < dataObj[i].time) {
            return i - 1;
        }
    }
    return dataObj.length -1;
}

function parseStr (str) {
    const obj =[]
    for(let i =0;i< str.length;i++) {
        const dataItem = str[i].split("]")
        const timeArr = dataItem[0].substring(1).split(':')
        const time = +timeArr[0] * 60 + +timeArr[1];
        obj.push({
            time: time,
            words: dataItem[1]
        })
    }    
    return obj
}

function createEl() {
    const el = document.createDocumentFragment();
    for(let i = 0; i< dataObj.length; i++ )
    {
        const li = document.createElement('li');
        li.textContent = dataObj[i].words;
        el.appendChild(li);
    }
    dom.ul.appendChild(el);
}


function setOffset() {
    const index = findIndex()
    const offSet = index * 30 + 15 - 210;
    const li = document.querySelector(".active")
    if(li) {
        li.classList.remove('active')
    }
    dom.ul.style.transform = `translateY(-${offSet}px)`
    dom.ul.children[index].classList.add('active');
    console.log(offSet)
}


createEl();
dom.audio.addEventListener('timeupdate', setOffset);

console.log(dataObj)