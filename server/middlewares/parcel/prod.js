// 生产环境： 提供了静态文件的访问能力
const Bundler = require('parcel-bundler')
const views = require('koa-views')
const serve = require('koa-static')
const { resolve } = require('path')

const r = path => resolve(__dirname, path)

export const dev = async app => {
    app.use(serve(r('../../../dist')))
    app.use(views(r('../../../dist')), {
        extension: 'html'
    })

    app.use(async (ctx) => {
        await ctx.render('index.html')
    })
}

