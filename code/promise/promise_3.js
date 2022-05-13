/*
第三版：完善then方法，重点实现then中的resolvePromise方法
 */

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    this.status = PENDING; // 状态
    this.value = undefined; // fulfilled状态，保存终值
    this.reason = undefined; // rejected状态，保存据因

    this.onFulfilledCallback = []; // onFulfilled回调函数队列
    this.onRejectedCallback = []; // onRejected回调函数队列

    const resolve = (value) => {
      if (value instanceof MyPromise) {
        return value.then(resolve, reject);
      }
      // 使用setTimeout模拟异步事件
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = FULFILLED;
          this.value = value;
          this.onFulfilledCallback.forEach(cb => cb(this.value));
        }
      });
    }

    const reject = (reason) => {
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = REJECTED;
          this.reason = reason;
          this.onRejectedCallback.forEach(cb => cb(this.reason));
        }
      })
    }

    try {
      executor(resolve, reject);
    } catch(err) {
      this.reject(err);
    }
  }

  /*
  调用then方法的Promise状态确定时就可以调用onFulfilled/onRejected回调了
  如果不确定则需要将onFulfilled和onRejected分别推入回调函数队列中
   */
  then(onFulfilled, onRejected) {
    /* 实现resolvePromise方法，它的作用是用来确定then方法返回的promise对象的状态
    -------------------------------------------------------------------------------------------------------------------------------------
    onFulfilled/onRejected函数的返回值            | then返回的Promise对象的状态             | then返回的Promise对象的resolve/reject回调的参数
    -------------------------------------------------------------------------------------------------------------------------------------
    具体的值x 或者                                | fulfilled                             | x这个值会作为resolve的参数
    没有返回任何值（相当于return undefined）       |                                       |
    -------------------------------------------------------------------------------------------------------------------------------------
    抛出一个错误err                               | rejected                              | err会作为reject的参数
    -------------------------------------------------------------------------------------------------------------------------------------
    一个Promise对象（*）                          |                                       |
    这个对象是fulfilled状态，它的resolve参数value  | fulfilled                             | value作为resolve的参数
    这个对象是rejected状态，它的reject参数reason   | rejected                              | reason作为reject的参数
    这个对象是pending状态                         | pending状态，并且跟随*这个对象的状态变化 | 跟*这个对象的终态时调用的resolve/reject参数一致
     */
    const resolvePromise = (promise, result, resolve, reject) => {
      if (result === promise) {
        reject(new TypeError('循环引用'));
      }

      // 返回值是一个promise对象时
      if (result instanceof MyPromise) {
        if (result.status === PENDING) {
          result.then(
            (res) => resolvePromise(promise, res, resolve, reject),
            (err) => resolvePromise(promise, err, resolve, reject)
          );
        } else {
          result.then(resolve, reject);
        }
      } else if (result && (typeof result === 'object' || typeof result === 'function')) {
        let called = false;
        try {
          let then = result.then;
          if (typeof then === 'function') {
            then.call(result, v => {
              if (called) return;
              called = true;
              resolvePromise(promise, v, resolve, reject);
            }, r => {
              if (called) return;
              called = true;
              reject(r);
            })
          } else {
            resolve(result);
          }
        } catch(e) {
          if (called) return;
          called = true;
          reject(e);
        }
      } else {
        resolve(result);
      }
    }

    // 对参数的处理
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    onRejected = typeof onRejected === 'function' ? onRejected : (reason) => { throw reason };

    const promise = new MyPromise((resolve, reject) => {
      // 情况1：调用then方法的是一个已经改变状态的promise对象，此时会立即执行onFulfilled/onRejected，而不需要推入对应的队列中
      if (this.status === FULFILLED) {
        try {
          const res = onFulfilled(this.value);
          resolvePromise(promise, res, resolve, reject);
        } catch(e) {
          reject(e);
        }
      } else if (this.status === REJECTED) {
        try {
          const res = onRejected(this.reason);
          resolvePromise(promise, res, resolve, reject);
        } catch(e) {
          reject(e);
        }
      }
      // 情况2：调用then方法的promise对象状态还未改变，此时需要把onFulfilled/onRejected方法推入对应的队列中
      else {
        this.onFulfilledCallback.push((value) => {
          try {
            const res = onFulfilled(value); // value就是resolve时传递的参数, 得到返回值
            resolvePromise(promise, res, resolve, reject);
          } catch(e) {
            reject(e);
          }
        });
        this.onRejectedCallback.push((reason) => {
          try {
            const res = onRejected(reason);
            resolvePromise(promise, res, resolve, reject);
          } catch(e) {
            reject(e);
          }
        });
      }
    });
    return promise;
  }
}

