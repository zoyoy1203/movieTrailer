

const {  
    Controller,
    Get,
    Required, 
} = require('../lib/decorator')
const { 
    getAllMovies,
    getMovieDetail,
    getRelativeMovies
} = require('../service/movie');

@Controller('/movies')
export class movieController{
    @Get('/all')
    async getMovies (ctx, next) {
        const { type, year } = ctx.query;
        const movies = await getAllMovies(type, year);
    
        ctx.body = {
            success: true,
            data: movies
        }
    }


    @Get('/detail/:id')
    async getMovieDetail (ctx, next) {
        // const Movie = mongoose.model('Movie')
        // const id = ctx.params.id;
        // const movie = await Movie.findOne({_id: id})
        const id = ctx.params.id;
        const movie = await getMovieDetail(id);
        const relativeMovies = await getRelativeMovies(movie);
        ctx.body = {
            data: {
                movie,
                relativeMovies  // 同类电影
            },
            success: true
        }
    }
}
    
