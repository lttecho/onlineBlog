# 异步编程（二）——Promise

## Promise的由来

在Promise出现之前，使用回调函数实现异步操作是唯一的方法，但是回调函数本身容易出现回调地狱，并且不便于复用代码。

于是，大家就开始思考有没有一种写法，能够像同步操作一样的调用异步操作，使得代码纵向发展而非横向发展。

在JavaScript的一个文档中看到一个简单而形象的比喻，当然Promise的实际作用会更强大：

> ![img](.\Promise类比.png)



## Promise的使用

### 创建Promise对象

Promise实际上是一个对象，由new Promise()构造函数返回。

具体的语法：

```javascript
let p1 = new Promise(function(resolve, reject));
```

在new Promise()构造函数中，需要传入一个函数，这个函数有两个参数，一个是resolve函数，一个是reject函数.

看起来好像有点复杂，传入函数参数，函数参数又是函数......

实际上非常容易理解，new Promise构造函数的参数是一个函数，这个函数中有两个参数，resolve和reject其实是Promise提供给我们的，我们不需要自己去实现。resolve()函数处理的是成功的结果，reject()函数处理的是失败的结果。

一般用法：

```javascript
let p1 = new Promise(function(resolve, reject) {
    // 生产者代码
    if (成功) {
        resolve('成功');
    } else if(失败) {
        reject('失败');
    }
})

// 或者可以用箭头函数，resolve和reject形参也可以用别的名称，这只是形参的名字而已，因为new Promise构造函数中的参数是Promise提供给我们的，我们不需要也不能自己去实现
let p1 = new Promise((success, fail) => {
    // 生产者代码
    if (成功) {
        success('成功');
    } else if (失败) {
        fail('失败'); 
    }
})
```

传递给`new Promise`的函数`(resolve, reject) => {}` 被称为`executor`。当Promise对象被创建时，executor就会自动运行（也就是立即运行，是我们无法控制的）。它的参数`resolve`和`reject`都是Promise自身提供的回调函数，不需要我们实现，我们需要实现的代码是放在executor的内部。

### Promise的三种状态以及resolve和reject的使用

Promise对象有三种状态，它必然处于这三种状态之一：

- 初始状态pending
- 成功状态fulfilled
- 失败状态rejected

这三种状态只能按照下面的规则变化，且状态的变化是不可逆的：

- pending -> fulfilled
- pending -> rejected







**resolve()函数：异步操作成功之后执行的回调函数**，也就是状态从pending变成fulfilled状态后要执行的回调函数。

> resolve函数接受一个参数，并会以这个值返回一个Promise对象。
>
> 

**reject()函数：异步操作失败之后执行的回调函数**，也就是状态从pending变成rejected状态后要执行的回调函数。



### 链式调用



### Promise的约定

Promise



### 



### 错误处理







### Promise的API

打印下Promise对象可以看到它提供的API：

![img](.\图片一.png)

- Promise.resolve()
- Promise.reject()
- Promise.prototype.then()
- Promise.prototype.catch()
- Promise.prototype.finally()

- Promise.all()
- Promise.race()



## Promise的优缺点

