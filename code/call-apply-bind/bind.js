/**
 * bind的区别：不会立即执行，而是返回一个函数
 * 关键点：
 * 1、改变this指向：因为不会立即执行，所以不能直接给对象上加函数属性；因此返回函数调用call或apply的结果即可
 * 2、传参：bind可以分次传参，也就是说bind可以传参，bind返回的函数也可以传参
 * 3、*兼容new关键字：bind返回的函数可以是一个构造函数，此时bind指定的context绑定this会失效，但是传入的参数有效。
 * 其他关键点同call
 */

Function.prototype.myBind = function(context, ...bindArgs) {
  const fn = this;
  const resFn = function() {
    const args = bindArgs.concat([...arguments]); // 实现多次传参
    /* 作为构造函数时，this指向实例对象，所以通过判断this是不是Fn的实例就可以判断是否是构造函数了 */
    return this instanceof resFn ? fn.call(this, ...args) : fn.call(context, ...args);
  }
  // 优化：这里将返回的Fn函数的原型对象和调用者函数的原型对象关联起来，是为了new的实例对象也能访问到调用者函数的原型上的属性
  resFn.prototype = fn.prototype;
  return resFn;
}

Function.prototype.myBind2 = function(context, ...bindArgs) {
    const fn = this;
    let resFnCopy = function() {}
    const resFn = function() {
      const args = bindArgs.concat([...arguments]);
      return this instanceof resFnCopy ? fn.call(this, ...args) : fn.call(context, ...args);
    }
    // 优化：通过一个空函数来中转，可以避免修改resFn.prototype时影响了fn.prototype
    resFnCopy.prototype = fn.prototype;
    resFn.prototype = new resFnCopy();
    return resFn;
  }
