
const doSync = (sth, time) => new Promise(resolve => {
    setTimeout(() => {
        console.log(sth + '用了' + time + '毫秒')
        resolve()
    }, time)
})

const doAsync = (sth, time, cb) => {
    setTimeout(() => {
        console.log(sth + '用了' + time + '毫秒')
        cb && cb()  // 如果有回调的话，就执行回调函数
    }, time)
}

const doElse = (sth) => {
    console.log(sth)
}

const Scott = { doSync, doAsync }
const Meizi = { doSync, doAsync, doElse }

;(async () => {
    // 同步
    console.log('case1: 妹子来到门口')
    await Scott.doSync('Scott 刷牙', 1000)
    console.log('啥也没干，一直等')
    await Meizi.doSync('妹子洗澡',2000)
    Meizi.doElse('妹子去忙别的了')

    // 异步
    console.log('case3: 妹子来到门口按下通知开关')
    Scott.doAsync('Scott 刷牙', 1000, () => {
        console.log('卫生间通知妹子来洗澡')
        Meizi.doAsync('妹子洗澡', 2000)
    })
    Meizi.doElse('妹子去忙别的了')


})()