/**
 * 版本一：递归拷贝
 */

function deepClone_1(src) {
  const dst = {}; // 需要返回的对象
  for(const prop in src) {
    if (src.hasOwnProperty(prop)) { // 不能拷贝原型对象上的属性
      if (typeof src[prop] === 'object') {
        dst[prop] = deepClone_1(src[prop]);
      } else {
        dst[prop] = src[prop];
      }
    }
  }
  return dst;
}

/**
 * 版本二：增加对数组的拷贝，对对象的判断处理
 */
function deepClone_2(src) {
  const isObject = (s) => {
    let type = typeof s === 'object';
    if (s === null) {
      type = false;
    }
    return type;
  }

  const type = isObject(src);

  if (type) {
    const dst = Array.isArray(src) ? [] : {};
    for (const key in src) {
      if (src.hasOwnProperty(key)) {
        if (isObject(src[key])) {
          dst[key] = deepClone_2(src[key]);
        } else {
          dst[key] = src[key];
        }
      }
    }
    return dst;
  } else {
    return src;
  }
}


let obj = {
  name: 111
};

let a = {
  a1: obj,
  a2: obj
}

let b = deepClone_2(a);
console.log(a.a1 === a.a2);
console.log(b);
console.log(b.a1 === b.a2);
