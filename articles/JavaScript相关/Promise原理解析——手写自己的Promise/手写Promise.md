# 手写Promise——ES6版

## Promise规范

Promise 规范有很多，如 Promise/A，Promise/B，Promise/D 以及 Promise/A 的升级版 Promise/A+，最终 ES6 中采用了 Promise/A+ 规范。

> Promise/A+规范文档：
>
> 英文：https://promisesaplus.com/
>
> 中文： https://www.ituring.com.cn/article/66566

Promise/A+规范文档中指出，该文档不涉及如何实现创建、解决和拒绝Promise，而专注于提供如何实现一个通用的then方法。



Promise的基本使用是这样的：

```javascript
new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('success');
    }, 1000);
}).then((res) => {
    console.log(`resolve's value is ${res}`);
}, (err) => {
    console.log(`reject's value is ${err}`);
});
```



根据Promise/A+的规范文档，总结了以下需要满足的要求：

1、Promise的状态

- 一个Promise对象必须处于**3种状态之一**，即pending（初始状态）、fulfilled（成功状态）、rejected（失败状态）。
- 状态的改变只能从pending到fulfilled，或者从pending到rejected，且**状态的改变是不可逆的**。

2、Promise内部必须提供**resolve方法**和**reject方法**

resolve和reject两个方法的作用都是：改变Promise对象的状态；状态改变时给Promise对象传入一个任意类型的值。

> resolve(value)

- 该方法用于将Promise的状态从pending变为fulfilled。

- resolve函数接收一个参数，这个参数是传递给Promise对象的成功的值。

  

> reject(reason)

- 该方法用于将Promise的状态从pending变为rejected。

- reject函数接收一个参数，这个参数是传递给Promise对象的失败的值。

  

3、Promise的值

- Promise的值是指，当Promise对象的状态变化时传递给回调函数的值。

- 当Promise对象的状态变化成fulfilled时，resolve函数的参数会作为成功的值传递给Promise对象，且这个值不可改变。
- 当Promise对象的状态变化成rejected时，reject函数的参数会作为失败的值传递给Promise对象，且这个值不可改变。



4、Promise的then方法

​      一个Promise对象，必须有一个then方法来获取它的值。

> Promise.then(onResolved, onRejected)



- then方法的参数

  - onResolved和onRejected都是可选参数。

  - onResolved和onRejected必须是函数，否则被忽略。

  - 当onResolved是一个函数时：

    - 在Promise对象的resolve执行后必须被调用（Promise状态从pending变为fulfilled后），第一个参数就是Promise对象的值（也就是resolve函数提供的参数，称为终值）

    - 在Promise对象未执行resolve时，不能被调用

    - 调用次数不能超过一次（也就是要么永远没被调用，要么只能调用一次）

      

  - 当onRejected是一个函数时：

    - 在Promise对象被拒绝执行后必须被调用（Promise状态从pending变为rejected后），第一个参数就是Promise对象的值（也就是reject函数提供的参数，称为拒因）
    - 在Promise对象未执行reject时，不能被调用
    - 调用次数不能超过一次（也就是要么永远没被调用，要么只能调用一次）

- 可以被同一个Promise对象多次调用

  - 当Promise对象成功执行时，所有的onResolved必须按照注册的顺序依次回调
  - 当Promise对象拒绝执行时，所有的onRejected必须按照注册的顺序依次回调

- 返回值
  - then方法必须返回一个Promise对象（规范中并没有指明这个Promise对象是新的还是原来的旧对象，但是ES6中是返回了一个全新的Promise对象，所以本文中也采用这种方式），以支持链式调用。



## 基础实现

第一步，先实现一个简单的Promise类，这个函数需要满足以下的几个条件：

1、构造函数传入的参数要求是一个函数，这个函数是一个执行器executor，会立即执行；

2、内部需要提供resolve和reject函数，供传入的executor调用；

3、Promise对象有3种状态，resolve函数和reject函数需要改变Promise对象的值和状态。

具体实现：

```javascript
// 声明状态值
const PENDING = 'pending';
const RESOLVED = 'fulfilled';
const REJECTED = 'rejected';

class Promise {
    constructor(executor) {
        this._status = PENDING; // 声明Promise对象的状态，初始化为PENDING
        this._data = undefined; // 声明Promise对象的值

        executor(this.resolve.bind(this), this.reject.bind(this)); // 传入的executor函数要立即执行
    }
    
    /* 定义resolve方法
    ** resolve方法要改变Promise对象的状态和值
    */
    resolve(value) {
        if (this._status !== PENDING) {
            return;
        }

        this._status = RESOLVED;
        this._data = value;
    }

    /* 定义reject方法
    ** reject方法要改变Promise对象的状态和值
    */
    reject(reason) {
        if (this._status !== PENDING) {
            return;
        }

        this._status = REJECTED;
        this._data = reason;
    }
}
```

上面这段代码只是最基本的一个Promise对象的框架实现，没有考虑对输入的校验，对错误的处理，以及私有变量，这些都在最后实现了基本功能后再添加。

这里的resolve和reject函数，对外是直接调用的，没有用this指针调用，所以必须在内部绑定this对象。



## 链式调用then方法

```javascript
// 声明状态值
const PENDING = 'pending';
const RESOLVED = 'fulfilled';
const REJECTED = 'rejected';

// 增加一个判断是否是函数的方法
function isFunction(func) {
    return typeof func === 'function';
}

class Promise {
    constructor(executor) {
        if (!isFunction(executor)) {
            throw new Error('Promise must accept a function as a parameter!');
        }
        
        this._status = PENDING; // 声明Promise对象的状态，初始化为PENDING
        this._data = undefined; // 声明Promise对象的值
        
        this._onResolvedCallback = [];  // 声明一个数组，保存then方法中的第一个参数onResolved函数
        this._onRejectedCallback = [];  // 声明一个数组，保存then方法中的第二个参数onRejected函数
        
        try {
            executor(this.resolve.bind(this), this.reject.bind(this)); // 传入的executor函数要立即执行
        } catch(error) {
            this.reject(error);
        }
    }
    
    /* 定义resolve方法
    ** resolve方法要改变Promise对象的状态和值
    */
    resolve(value) {
        if (this._status !== PENDING) {
            return;
        }
        
        const run = () => {
            try {
            	this._status = RESOLVED;
        		this._data = value;
            
            	let func;
            	while(func = this._onResolvedCallback.shift()) {
                	func(value);
            	}
        	}
        }
        
        setTimeout(() => run(), 0);
    }

    /* 定义reject方法
    ** reject方法要改变Promise对象的状态和值
    */
    reject(reason) {
        if (this._status !== PENDING) {
            return;
        }

        const run = () => {
        	this._status = REJECTED;
        	this._data = reason;
            
            let func;
            while(func = this._onRejectedCallback.shif()) {
                func(reason);
            }
        }
        
        setTimeout(() => run(), 0);
    }
    
    /* 定义then方法
    */
    then(onResolved, onRejected) {
        const { _status, _data } = this;
    
        return new Mypromise((nextResolve, nextReject) => {
            // 定义一个成功时的执行函数，把onResolved包装进去
            const _onResolved = (value) => {
                try {
                    if (!isFunction(onResolved)) {
                        nextResolve(value);
                    } else {
                        const res = onResolved(value);
                        if (res instanceof Promise) {
                            res.then(nextResolve, nextReject);
                        } else {
                            nextResolve(res);
                        }
                    }
                } catch(error) {
                    nextReject(error);
                }
            }
            
            // 定义一个失败时的执行函数，把onRejected包装进去
            const _onRejected = (reason) => {
                try {
                    if (!isFunction(onRejected)) {
                        nextReject(reason);
                    } else {
                        const res = onRejected(reason);
                        if (res instanceof Promise) {
                            res.then(nextResolve, nextReject);
                        } else {
                            nextReject(res);
                        }
                    }
                } catch(error) {
                    nextReject(error);
                }
            }
            
            switch(_status) {
            	case PENDING:
                	this._onResolvedCallback.push(_onResolved);
                	this._onRejectedCallback.push(_onRejected);
                	break;
            	case RESOLVED:
               	 	_onResolved(_data);
                	break;
            	case REJECTED:
                	_onRejected(_data);
                	break;
        	}
        });
    }
}
```





## 原型方法实现





## 静态方法实现





## 测试

如何确定我们实现的Promise符合标准呢？Promise有一个配套的[测试脚本](https://github.com/promises-aplus/promises-tests)，只需要我们在一个CommonJS的模块中暴露一个deferred方法（即exports.deferred方法），就可以了，代码见上述代码的最后。然后执行如下代码即可执行测试







实现过程

1、 