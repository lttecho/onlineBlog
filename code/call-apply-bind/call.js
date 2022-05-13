/**
 * 关键点：
 * 1、必须在Function的原型对象上实现
 * 2、改变this指向：给指定的对象增加一个函数属性，然后执行该函数，执行完后删除该属性
 * 3、不定参数传递：可以使用arguments截断的方式处理，也可以使用ES6的语法（...）
 * 4、特殊对象的处理：如果没有传递对象，或者传递的是null、undefined时，要将this指向window
 * 5、函数返回值：需要返回函数执行结果
 */

Function.prototype.myCall = function(context, ...args) {
  context = context || window; // 处理特殊对象
  context.fn = this;
  const res = context.fn(...args);
  delete context.fn;
  return res;
}

Function.prototype.myCall2 = function(context) {
  context = context || window; // 处理特殊对象
  const len = arguments.length;
  const args = [];
  for (let i = 1; i < len; i++) {
      args.push(arguments[i]);
  }
  
  context.fn = this;
  const res = context.fn(...args);
  delete context.fn;
  return res;
}

Function.prototype.myApply = function(context, args) {
  if (!Array.isArray(args)) {
    throw TypeError('type error');
  }
  context = context || window;
  context.fn = this;
  const res = context.fn(...args);
  delete context.fn;
  return res;
}

var a = 0;

let obj = {
  a: 1
};

function test(x) {
  console.log(this.a);
}

