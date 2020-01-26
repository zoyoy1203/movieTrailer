
// 爬API 数据接口
const rp = require('request-promise-native');
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
const Category = mongoose.model('Category');

async function fetchMovie (item) {
    const url = `http://douban.uieee.com/v2/movie/subject/${item.doubanId}`;
    const res = await rp(url);
    let body 
    try {
        body = JSON.parse(res)
    } catch (err) {
        console.log(err)
    }
    return body;
}

;(async () => {
    // {
    //     $or: [
    //         { cover: null},
    //         { summary: { $exists: false}},
    //         { summary: null },
    //         { title: '' },
    //         { summary: ''}
    //     ]
    // }
    let movies = await Movie.find()

    // 测试时只查询一次movie  movies.length
    for (let i =0; i<movies.length; i++) {
        let movie = movies[i];
        let movieData = await fetchMovie(movie)

        console.log(i)

        if(movieData) {
            movie.tags =  movieData.tags || [];
            movie.summary = movieData.summary;
            movie.title = movieData.alt_title || movieData.title || '';
            movie.rawTitle =  movieData.title || '';
            movie.country = movieData.countries || ['未知'];

            if(movieData.pubdates){
                let dates = movieData.pubdates || []
                let pubdates = []
        
                dates.map(item => {
                  if (item && item.split('(').length > 0) {
                    let parts = item.split('(')
                    let date = parts[0]
                    let country = '未知'
        
                    if (parts[1]) {
                      country = parts[1].split(')')[0]
                    }
        
                    pubdates.push({
                      date: new Date(date),
                      country
                    })
                  }
                })
        
                movie.pubdate = pubdates
            }

            if( movieData.trailers.length >0) {
                movie.video = movieData.trailers[0].resource_url ;
                movie.cover = movieData.trailers[0].medium ;
            }else{
                movie.video =  null;
                movie.cover =  null;
            }
         

            movie.movieTypes = movieData.genres || [];
            // 循环查看创建Category是否存在该分类,存储分类和相应电影_id
            for (let i=0; i<movie.movieTypes.length; i++) {
                let item = movie.movieTypes[i]
                let cat = await Category.findOne({
                    name: item
                })
                if(!cat) {
                    cat = new Category({
                        name: item,
                        movies: [movie._id]
                    })
                }else {
                    if(cat.movies.indexOf(movie._id) === -1 ) {
                        cat.movies.push(movie._id)
                    }
                }
                await cat.save()

                if(!movie.category) {
                    movie.category.push(cat._id)
                } else {
                    if (movie.category.indexOf(cat._id) === -1) {
                        movie.category.push(cat._id)
                    }
                }

            }


            // console.log(movie)

            await movie.save()

        }
    }
})();