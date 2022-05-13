/*
第一版：基础功能
1、实现Promise构造函数
2、resolve和reject函数：改变状态和记录终值/拒因
3、执行executor函数
 */

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    this.status = PENDING; // 状态
    this.value = undefined; // fulfilled状态，保存终值
    this.reason = undefined; // rejected状态，保存据因

    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        console.log(this.status, this.value);
      }
    }

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        console.log(this.status, this.reason);
      }
    }

    try {
      executor(resolve, reject); // 这里要try catch一下，因为executor可能会执行出错
    } catch(err) {
      this.reject(err);
    }
  }
}

// 测试
let p = new MyPromise((resolve, reject) => {
  resolve('success');
})

/*
resolve和reject函数中的this必须与Promise实例绑定，所以这里是在构造函数中用箭头函数实现的，
当然还可以用别的方式，比如在构造函数之外实现，然后在executor执行前bind下（类似react16前的class组件内的做法）
 */

// class MyPromise {
//   constructor(executor) {
//     this.status = PENDING; // 状态
//     this.value = undefined; // fulfilled状态，保存终值
//     this.reason = undefined; // rejected状态，保存据因

//     try {
//     executor(this.resolve.bind(this), this.reject.bind(this)); // 必须绑定this为当前constructor中的this，也就是promise实例
//     } catch(err) {
//     this.reject(err);
//     }
//   }
  
//   resolve(value) {
//     this.status = FULFILLED;
//     this.value = value;
//     console.log(this.status, this.value);
//   }
  
//   reject(reason) {
//     if (this.status === PENDING) {
//     this.status = REJECTED;
//     this.reason = reason;
//     console.log(this.status, this.reason);
//     }
//   }
// }