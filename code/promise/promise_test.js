const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    this.status = this.PENDING; // 状态
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

  then(onFulfilled, onRejected) {
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

MyPromise.deferred = function() {
  let defer = {};
  defer.promise = new MyPromise((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
}

module.exports = MyPromise;
