
// https://douban.uieee.com/v2/movie/subject/25924056

const rp = require('request-promise-native');

async function fetchMovie (item) {
    const url = `http://douban.uieee.com/v2/movie/subject/${item.doubanId}`;
    const res = await rp(url);
    return res;
}

;(async () => {
    let movies = [
        { 
            doubanId: 1291560,
            title: '龙猫',
            rate: 9.2,
            poster:
             'https://img9.doubanio.com/view/photo/l_ratio_poster/public/p2540924496.jpg' 
        },
        { 
            doubanId: 30334073,
            title: '调音师',
            rate: 8.3,
            poster:
             'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2551995207.jpg' 
        }
    ];

    movies.map(async movie => {
        let movieData = await fetchMovie(movie);
        try {
            movieData = JSON.parse(movieData);
            console.log(movieData.tags);
            console.log(movieData.summary);
        } catch (err) {
            console.log(err);
        } 
    })
})();