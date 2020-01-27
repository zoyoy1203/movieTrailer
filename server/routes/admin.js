
const { 
    Controller, 
    Get, 
    Post, 
    Del,
    Put, 
    auth,
    admin,
    required
} = require('../lib/decorator')
const { 
    checkPassword
} = require('../service/user');
const { 
    getAllMovies,
    findAndRemove
} = require('../service/movie');



@Controller('/admin')
export class adminController{

    @Get('/movie/list')
    @auth
    @admin('admin')
    async getMovieList (ctx, next) {
        const movies = await getAllMovies();
    
        ctx.body = {
            success: true,
            data: movies
        }
    }

    @Del('/movies')
    @required({
        query: ['id']
    })
    async remove (ctx, next) {
        const id = ctx.query.id
        console.log(id)
        const movie = await findAndRemove(id)
        const movies = await getAllMovies()
        ctx.body = {
            data: movies,
            success: true
        }
    }

    @Post('/login')
    @required({
        body: ['email', 'password']
    })
    async login (ctx, next) {
        const { email, password } = ctx.request.body;
        const matchData = await checkPassword(email, password);
        if(!matchData.user) {
            return (ctx.body = {
                success: false,
                err: '用户不存在'
            })
        }

        if(matchData.match) {
            ctx.session.user = {
                _id: matchData.user._id,
                email: matchData.user.email,
                role: matchData.user.role,
                username: matchData.user.username
            }
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
    
