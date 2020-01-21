// 获取电影列表

const puppeteer = require('puppeteer')

const url = `https://movie.douban.com/tag/#/?sort=U&range=8,10&tags=`

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('Start visit the target page')

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })

  const page = await browser.newPage() // 开启一个新页面
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })  // 加载网页

  await sleep(3000)

  await page.waitForSelector('.more')  // 等待加载更多按钮出现

  for (let i = 0; i <1; i++) {  // 点击按钮一次
    await sleep(3000)
    await page.click('.more')
    await sleep(3000)
  }

  const result = await page.evaluate(() => {
    var $ = window.$
    var items = $('.list-wp a')
    var links = []

    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item)
        let doubanId = it.find('div').data('id')
        let title = it.find('.title').text()
        let rate = Number(it.find('.rate').text())
        let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')

        links.push({
          doubanId,
          title,
          rate,
          poster
        })
      })
    }

    return links
  })

  browser.close()
  // console.log(result);

  process.send({result})
  process.exit(0)
})()