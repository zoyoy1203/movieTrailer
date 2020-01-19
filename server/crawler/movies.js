const url = `https://v.qq.com/channel/movie?_all=1&channel=movie&listpage=1&sort=18`
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})

//定义页面内容及Jquery,数据列表
var content , $
var links = []

//数据处理
function processDate (items){
    console.log('进入数据处理')
    if(items.length >= 1 ){
        items.each((index, item) => {
            let it = $(item)
            // https://v.qq.com/x/cover/6983f15b7g5xch7.html
            movieId = it.find('a').data('float')
            title = it.find('.figure_detail_two_row a').text()
            actors = it.find('.figure_detail_two_row .figure_desc').text()
            cover = it.find('a img').attr('src')

            links.push({
                movieId,
                title,
                actors,
                cover
            })
        })
        console.log('数据处理成功！')
        // console.log(links)
    }else{
        console.log('长度不够')
    }
}



// 页面滚动方法
async function scrollPage(i,page) {
    console.log('第'+i+'次：')
    content = await page.content()
    $ = cheerio.load(content)
  
    // 获取数据列表
    if(i == 0){
        var items = $('.mod_figure_list_box .list_item')
        // console.log(items)
        processDate(items)
    }else{
        /*执行js代码（滚动页面）*/
        console.log('第'+i+'次刷新')
        await page.evaluate(async (i) => {
            /* 这里做的是渐进滚动，如果一次性滚动则不会触发获取新数据的监听 */
            console.log('开始滚动')
            for (var y = 0; y <= 3000*i; y += 100) {
                window.scrollTo(0,y)
            }
        },i)

        await sleep(3000)

        content = await page.content()
        $ = cheerio.load(content)

        var items =  $($('.mod_figure_list_box').children('svg')[i-1]).nextUntil('svg')

        await processDate(items)

    }
  
}



;(async () => {
    console.log('Start movies')

    const browser = await puppeteer.launch({ // 打开一个虚拟浏览器
        args: ['--no-sandbox'],
        dumpio: false,
        headless: false
    })

    const page = await browser.newPage()  // 打开一个页面
    await page.goto(url, {
        waitUntil: 'networkidle2'  // 当网页空闲的时候说明页面已经加载完毕了
    })
    await sleep(3000)

    var i = 0
    // 循环刷新i次
    while ( i < 2 ) {
        // let items = await scrollPage(i++)
        const scroll = scrollPage(i,page)
        await scroll
        i++
    }
    
    await browser.close()
    // console.log(links)
    console.log(links.length)

})()