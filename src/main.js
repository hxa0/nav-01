//为了hashmap调用，放在前
const $siteList = $('.siteList') //定义siteList  api
const $lastLi = $siteList.find('li.last') // 在sitewList里面寻找最后一个li
const x = localStorage.getItem('x') //读取当前网站下的x
    //x变成对象
const xObject = JSON.parse(x)
    //如果x存在，就把它放到hashMap里面，如果是空的，就初始化成数组
const hashMap = xObject || [
    //每个网站模块是个数组，是由hash表组成的数组，现有两个网站//对于现有两个网站的渲染 
    { logo: 'A', logoType: 'text', url: 'https://www.acfun.cn' }, //acfun 网站要素
    { logo: 'B', logoType: 'image', url: 'https://www.bilibili.com' } //bilibili网站要素
];
// link文本优化，去除前面的http,www等
const simplifyUrl = (url) => { //接收url  
    return url.replace('https://', '') //设置返回值 
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '') //删除/开头的内容
}


//封装好一个函数，包含着对hsashMap的操作函数
const render = () => {
    //找到li但是不找最后一个,然后去除掉//其实就是去除最开始的两个，因为外面已经渲染过了
    $siteList.find('li:not(.last)').remove()
        //遍历hashMap，把新的li放进去//通用写法
    hashMap.forEach((node, index) => { //hashMap索引
        console.log(index)
        const $li = $(`<li>                         
            
                    <div class="site">
                        <div class="logo">${node.logo}</div>
                        <div class="link">${simplifyUrl(node.url)}</div> 
                        <div class="close">
                        <svg class="icon">
                           <use xlink:href="#icon-close"></use>
                         </svg>
                        </div>             
                    </div>
            </li>`).insertBefore($lastLi)
            //代替a标签
        $li.on('click', () => {
                window.open(node.url)
            })
            //取消关闭按钮冒泡
        $li.on('click', '.close', (e) => {
            e.stopPropagation()
            console.log(hashMap)
            hashMap.splice(index, 1) //hashMap里面删除当前索引开始，删除1个
            render() //删除之后再一次渲染
        })

    })
}



//声明了函数，调用render()    
render()
    //添加网站事件处理
$('.addButton')
    .on('click', () => {
        let url = window.prompt('请问你要添加的网址是什么？')

        //#添加网址栏
        //#优化，无论用户输入什么格式，都自动转化成https开头
        //#作用：增加安全性，用户不需要自己修改输入格式，提升用户体验

        if ((url.indexOf('https') !== 0) && (url.indexOf('http') !== 0)) { //判断既不是http开头，也不是https开头  //比如是 baidu.com这种网址
            url = 'https://' + url // 地址前面添加https://
        } else if ((url.indexOf('http') == 0) && (url.indexOf('https') !== 0)) { //判断 如果是http开头，并且不是https开头//筛选出http开头，并且排除掉https，防止bug,因为https也满足http开头
            url = url.replace('http', 'https') //http网址替换成https
        }
        //剩下的就是https开头的网站不作调整

        console.log(url)
            //添加按钮点击事件，把这个对象放到hashMap数组里面
        hashMap.push({ logo: simplifyUrl(url)[0].toUpperCase(), logoType: 'text', url: url })
            //调用函数，对hashMap操作
        render()
    })

window.onbeforeunload = () => {
    console.log('页面要关闭了')
        //不能直接存数组，要先转化成字符串
    const string = JSON.stringify(hashMap)
        //localStorage里面有个x端口，存放字符串
    localStorage.setItem('x', string)
}


//键盘事件
$(document).on('keypress',(e)=>{

const{key}=e   //与 const key=e.key等价
for(let i=0;i<hashMap.length;i++){
    if(hashMap[i].logo.toLowerCase()===key){
        window.open(hashMap[i].url)
    }
}
})
