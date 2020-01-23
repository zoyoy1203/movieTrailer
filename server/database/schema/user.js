const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const SALT_WORK_FACTOR = 10   // 加密  盐值
const MAX_LOGIN_ATTEMPTS = 5 // 最大登录失败次数
const LOCK_TIME = 2*60 * 60 *1000  // 锁定时间 2小时

const userSchema = new Schema({
    username: {
        unique: true,  // 唯一，不允许重复
        required: true,
        type: String
    },
    email: {
        unique: true,
        required: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
    loginAttempts: {  // 登录限制次数+
        type: Number,
        required: true,
        default: 0
    },
    lockUntil: Number,  // 锁定时间
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

userSchema.virtual('isLocked').get(() => {
    return !!(this.lockUntil && this.lockUntil > Date.now());  // 判断锁定时间是否过期
})


userSchema.pre('save',  function (next)  {
    if(this.isNew){
        this.meta.createdAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now();
    }
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if(err) return next(err);
        bcrypt.hash(this.password, salt, (error, hash) => {
            if(error) return next(error);
            this.password = hash;
            next();
        })
    })
    
    next();
});

userSchema.methods = {
    // 判断输入的密码与数据库加密密码是否一致
    comparePassword: (_password, password) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, password, (err, isMatch) => {
                if(!err) resolve(isMatch);
                else reject(err);
            })
        })
    },

    incLoginAttepts: (user) => {
        return new Promise((resolve, reject) => {
            if(this.lockUntil && this.lockUntil < Date.now()) {
                this.update({
                    $set: {
                        loginAttempts: 1
                    },
                    $unset: {
                        lockUntil: 1
                    }
                }, (err) => {
                    if(!err) resolve(true)
                    else reject(err)
                })
            }else {
                let updates = {
                    $inc: {
                        loginAttempts: 1
                    }
                }

                if( this.loginAttempts+1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
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