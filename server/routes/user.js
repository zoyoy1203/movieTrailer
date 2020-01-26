const { Controller, Get, Post, Put } = require('../lib/decorator')
const { 
    checkPassword
} = require('../service/user');

@Controller('/api/v0/movies')
export class userController{
    @Post('/')
    async checkPassword (ctx, next) {
        const { email, password } = ctx.request.body;
        const matchData = await checkPassword(email, password);

        if(!matchData.user) {
            return (ctx.body = {
                success: false,
                err: '用户不存在'
            })
        }

        if(matchData.match) {
            return (ctx.body = {
                success: true
            })
        }

        return (ctx.body = {
            success: false,
            err: '密码不正确'
        })
    
    }

}
    
