
const qiniu = require('qiniu');
const mongoose = require('mongoose')
const nanoid = require('nanoid');
const config = require('../config/index.js');

const bucket = config.qiniu.bucket;
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK);
const cfg = new qiniu.conf.Config();
const client = new qiniu.rs.BucketManager(mac, cfg);

const Movie = mongoose.model('Movie')

const uploadToQiniu = async (url, key) => {
    return new Promise((resolve, reject) => {
      client.fetch(url, bucket, key, (err, ret, info) => {
        if (err) {
          reject(err)
        }
        else {
          if (info.statusCode === 200) {
            resolve({ key })
          } else {
            reject(info)
          }
        }
      })
    })
  }
  
  ;(async () => {
    let movies = await Movie.find({
      $or: [
        {videoKey: {$exists: false}},
        {videoKey: null},
        {videoKey: ''}
      ]
    }).exec()
  
  
    for (let i = 0; i < movies.length; i++) {
      let movie = movies[i]
      console.log(i)
    

      if (movie.video && !movie.videoKey) {
        try {
          let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
        
          if (videoData.key) {
            movie.videoKey = videoData.key
          }
        } catch (err) {
          console.log(err)
        }
      }

      if (movie.cover && !movie.coverKey) {
        try {
          let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png')
          if (coverData.key) {
            movie.coverKey = coverData.key
          }
        } catch (err) {
          console.log(err)
        }
      }

      if (movie.poster && !movie.posterKey) {
        try {
          let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')
          if (posterData.key) {
            movie.posterKey = posterData.key
          }
        } catch (err) {
          console.log(err)
        }
      }

      if(movie.videoKey || movie.coverKey ||  movie.posterKey ){
        await movie.save()
      }


    }
  })()
  