// 获取预告片详情页和视频

const puppeteer = require('puppeteer')

const base = `https://movie.douban.com/subject/`;
const doubanId = '30166972';
const videoBase = `https://movie.douban.com/trailer/254875/`;

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
  await page.goto(base + doubanId, {
    waitUntil: 'networkidle2'
  })  // 加载网页

  await sleep(1000)

  const result = await page.evaluate(() => {
    var $ = window.$
    var it = $('.related-pic-video')
    console.log(it)
    if(it && it.length>0 ) {
        var link = it.attr('href');
        var cover = it.attr('style');
        
        var indexA = cover.indexOf('(');
        var indexB = cover.indexOf(')');
        cover = cover.substr(indexA+1,indexB-indexA-1);

        return {
            link,
            cover
        }
    }

    return {}
  })


  let video 
  if ( result.link) {
      await page.goto(result.link, {
          waitUntil: 'networkidle2'
      })
      await sleep(2000);

      video = await page.evaluate(() => {
          var $ = window.$;
          var it = $('source')

          if(it && it.length>0 ) {
              return it.attr('src');
          }

          return '';
      })
  }

  const data = {
      video,
      doubanId,
      cover: result.cover
  }


  browser.close()
  // console.log(result);

  process.send(data)
  process.exit(0)

})()