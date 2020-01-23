
const qiniu = require('qiniu');
const nanoid = require('nanoid');
const config = require('../config/index.js');

const bucket = config.qiniu.bucket;
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK);
const cfg = new qiniu.conf.Config();
const client = new qiniu.rs.BucketManager(mac, cfg);

const uploadToQiniu = async (url, key) => {
    return new Promise((resolve, reject) => {
        client.fetch(url, bucket, key, (err, ret, info) => {
            if(err) {
                reject(err);
            }else{
                if(info.statusCode === 200) {
                    resolve({ key })
                }else{
                    reject(info)
                }
            }
        })
    })
}

;(async () => {
    let movies = [{
        video: 'http://vt1.doubanio.com/202001212101/d5659dbff7442f0f96d1b56eaaf147f5/view/movie/M/402540875.mp4',
        doubanId: 30166972,
        title: '少年的你',
        rate: 8.3,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2572166063.jpg' ,
        cover: 'https://img9.doubanio.com/img/trailer/medium/2572850244.jpg?'
    }]
    
    movies.map(async movie => {
        if(movie.video && !movie.key) {
            try{
                console.log('开始传video');
                let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4');
                console.log('开始传cover');
                let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png');
                console.log('开始传poster');
                let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png');

                if(videoData.key) {
                    movie.videoKey = videoData.key
                }
                if(coverData.key) {
                    movie.coverKey = coverData.key
                }
                if(posterData.key) {
                    movie.posterKey = posterData.key
                }
                console.log(movie);
            }catch (err) {
                console.log(err);
            }
        }
    })

})()