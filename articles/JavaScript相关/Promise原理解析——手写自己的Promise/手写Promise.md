# 手写Promise——ts版

## Promise规范

Promise 规范有很多，如 Promise/A，Promise/B，Promise/D 以及 Promise/A 的升级版 Promise/A+，最终 ES6 中采用了 Promise/A+ 规范。

> Promise/A+规范文档：
>
> 英文：https://promisesaplus.com/
>
> 中文： https://www.ituring.com.cn/article/66566







## 基础实现

第一步，先实现一个简单的Promise类（或者实现一个Promise函数也是一样的），这个函数需要满足以下的几个条件：

1、构造函数传入的参数要求是一个函数，这个函数是一个执行器executor，会立即执行

2、内部需要提供resolve和reject函数，供传入的executor调用

3、构造函数的返回值是一个Promise对象

具体实现：

```javascript
class Promise {
    constructor(executor) {
        // 校验下用户输入的executor是否是function
        if (typeof executor !== 'function') {
            throw new TypeError(`${executor} is not a function`);
        }
        try {
            executor(this._resolve, this._reject); 
        } catch(error) {
            
        }
    }
    
    // 实现内部的resolve函数
    _resolve(value) {
        
    }
    
    // 实现内部的reject函数
    _reject(value) {}
}
```





## 链式调用实现





## 原型方法实现





## 静态方法实现





## 测试

如何确定我们实现的Promise符合标准呢？Promise有一个配套的[测试脚本](https://github.com/promises-aplus/promises-tests)，只需要我们在一个CommonJS的模块中暴露一个deferred方法（即exports.deferred方法），就可以了，代码见上述代码的最后。然后执行如下代码即可执行测试