const { Controller, Get, Post, Put } = require('../lib/decorator')
const { 
    checkPassword
} = require('../service/user');

@Controller('/admin')
export class userController{
    @Post('/login')
    async checkPassword (ctx, next) {
        const { email, password } = ctx.request.body;
        console.log(email)
        console.log(password)
        const matchData = await checkPassword(email, password);
        console.log(matchData)
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
    
