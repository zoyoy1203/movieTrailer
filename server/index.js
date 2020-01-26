const Koa = require('koa')
const cors = require('koa2-cors');

const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')
const routerRerfer = require('./routes/referer');

const R = require('ramda')
const MIDDLEWARES = ['router', 'parcel']

// 加载中间件数组
const useMiddleWares = (app) => {
    R.map(
        R.compose(
            R.forEachObjIndexed(
                initWith => initWith(app)
            ),
            require,
            name => resolve(__dirname, `./middlewares/${name}`)
        )
    )(MIDDLEWARES)
}



;(async () => {
    await connect()
    initSchemas()
    // require('./tasks/api')
    // require('./tasks/qiniu.js')
    // require('./tasks/movie')
    // const Movie = mongoose.model('Movie')
    // const movies = await Movie.find({})
    // console.log(movies)

    const app = new Koa()
    // 处理跨域
    app.use(cors())
    app.use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await next();
    });

    // 解决盗链
    app.use(routerRerfer.routes())

    await useMiddleWares(app);

    app.listen(3000)


})()



// app.use(views(resolve(__dirname, './views'), {
//     extension: 'pug'   // 只要后缀名为pug的文件，都会被识别为模板文件
// }))

// app.use(async (ctx, next) => {
   
//     await ctx.render('index', {
//         you: 'Luke',
//         me: 'Scott'
//     })
// })




