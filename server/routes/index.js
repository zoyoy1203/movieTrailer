const Router = require('koa-router')

const router = new Router()

router.get('/movies/all', async (ctx, next) => {
    const movies = await movies.find({}).sort({
        ''
    })
})