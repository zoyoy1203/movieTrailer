
const Router = require('koa-router') // koa 路由中间件
const router = new Router(); // 实例化路由
const request = require('request');

router.get('/api', async(ctx, next) => {
 
  var url=ctx.request.query.url;
    var options = {
         method: "GET",
         url:url,
         headers:{
            "Referer": request.host
         }
     };
     
    const PassThrough = require('stream').PassThrough;
    ctx.body = request(options)
        .on('response', response => {
            Object.keys(response.headers).forEach((key) => {
                // if ('content-length' === key) return;
                if ('transfer-encoding' === key) return;
                ctx.set(key, response.headers[key]);
            });
        })
        .on('error', ctx.onerror)
        .pipe(PassThrough())
});

module.exports = router;