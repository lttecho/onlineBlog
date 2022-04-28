/*
第二版：实现then方法，并完善resolve和reject的功能
1、resolve和reject功能完善：状态的改变需要在主线程空闲时执行（用setTimeout来模拟）
  状态改变后要监听或者执行回调函数队列中的函数（由then方法提供的onFulfilled/onRejected函数）
2、重点实现then方法：
  then接收两个参数onFulfilled/onRejected函数
  then返回一个Promise对象
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
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = FULFILLED;
          this.value = value;
          console.log(this.status, this.value);
        }
      });
    }

    const reject = (reason) => {
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = REJECTED;
          this.reason = reason;
          console.log(this.status, this.reason);
        }
      })
    }

    try {
      executor(resolve, reject);
    } catch(err) {
      this.reject(err);
    }
  }

  // 返回值是一个promise对象
  then(onFulfilled, onRejected) {
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

