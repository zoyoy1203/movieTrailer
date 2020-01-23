// 装饰器的使用

class Boy {
    @speak('呵呵')
    run () {
        console.log('I can run!')
        console.log('I can speak' + this.language)
    }

}

function speak (language) {
    return function (target, key, descriptor) {
        console.log(target)
        console.log(key)
        console.log(descriptor)
    
        target.language = language
        return descriptor
    }
}

// 参数 target对应类  key对应类的方法  descriptor对应描述的配置日志
// function speak (target, key, descriptor) {
//     console.log(target)
//     console.log(key)
//     console.log(descriptor)

//     return descriptor
// }

const luke = new Boy()

luke.run()