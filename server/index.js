const Koa = require('koa')
const app = new Koa()

const cors = require('koa2-cors');
// 处理跨域
app.use(cors())
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    await next();
});

mongoose = require('mongoose')
const views = require('koa-views')
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')

const router = require('./routes/referer');
app.use(router.routes());

;(async () => {
    await connect()
    initSchemas()
    require('./tasks/api')
    // require('./tasks/movie')
    // const Movie = mongoose.model('Movie')
    // const movies = await Movie.find({})
    // console.log(movies)
})()


app.use(views(resolve(__dirname, './views'), {
    extension: 'pug'   // 只要后缀名为pug的文件，都会被识别为模板文件
}))

app.use(async (ctx, next) => {
   
    await ctx.render('index', {
        you: 'Luke',
        me: 'Scott'
    })
})




app.listen(3000)