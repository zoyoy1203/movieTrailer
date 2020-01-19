const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { Mixed, ObjectId } = Schema.Types


const MovieSchema = new Schema({
    id: {
        unique:true,
        required: true,  // 值不能为空
        type:String
    },
    category: {
        type: ObjectId,
        ref: 'Category'
    },
    rate: Number,
    title: String,
    summary: String,
    video: String,
    poster: String,
    cover: String,

    videoKey: String,
    posterKey: String,
    coverKey: String,

    movieTypes: [String],
    pubdate: Mixed,
    year: Number,

    tags: [String],

    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }

})

MovieSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

mongoose.model('Movie', MovieSchema)