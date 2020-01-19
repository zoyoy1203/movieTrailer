const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2*60 * 60 *1000

const userSchema = new Schema({
    username: {
        unique: true,  // 值不能重复
        required: true,  // 值不能为空
        type: String,
    },
    email: {
        unique: true,
        required: true,  // 值不能为空
        type: String,
    },
    password: {
        unique: true,
        type: String,
    },
    loginAttempts: {  // 登录次数
        type: Number,
        required: true,  // 值不能为空
        default: 0
    },
    lockUntil: Number,
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        upAt: {
            type: Date,
            default: Date.now()
        }
    }
})

userSchema.virtual('isLocked').get( function () {
    return !!(this.lockUntil && this.lockUntil > Date.now())  //取两次反  true false
})

userSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})
userSchema.pre('save', function (next) {
    if (!user.isModified('password')) return next()
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {   //加盐
        if(err) return next(err)
        bcrypt.hash(user.password, salt, (error, hash) => { //加密
            if(error) return next(error) 
            this.password = hash
            next()
        })
    })
   
    next()
})


// methods  实例方法
userSchema.methods = {
    // 密码比较是否正确
    comparePassword: (_password, password) =>{
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, password,(err, isMatch) => {
                if (!err) resolve(isMatch)
                else reject(err)
            })
        })
    },

    // // 当前用户超过登录次数则锁定， 锁定时间过期则+1  否则修改锁定时间
    incLoginAttepts: (user) => {
        return new Promise((resolve, reject) => {
            if (this.lockUntil && this.lockUntil < Date.now()) {
                this.update({
                    $set: {
                        loginAttempts:1
                    },
                    $unset: {
                        lockUntil: 1
                    }
                }, (err) => {
                    if(!err) resolve(true)
                    else reject(err)
                })
            } else {
                let updates = {
                    $inc: {
                        loginAttempts: 1
                    }
                }

                if (this.loginAttempts +1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
                    updates.$set = {
                        lockUntil: Date.now() + LOCK_TIME
                    }
                }

                this.update(updates, err => {
                    if(!err) resolve(true)
                    else reject(err)
                })

            }
        })
        
    }

}


mongoose.model('User', userSchema)