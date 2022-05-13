/**
 * 版本三：利用hash表来解决循环引用的问题，但是仍然存在对象层级太深造成的递归爆栈问题
 */

function deepClone_hash(src, hashMap = new WeakMap()) {
  const isObject = (s) => {
    let type = typeof s === 'object';
    if (s === null) {
      type = false;
    }
    return type;
  }

  const type = isObject(src);

  if (type) {
    if (hashMap.has(src)) {
      return hashMap.get(src);
    }
    
    const dst = Array.isArray(src) ? [] : {};
    hashMap.set(src, dst); // 只将引用类型的数据存入hashMap中
    for (const key in src) {
      if (src.hasOwnProperty(key)) {
        if (isObject(src[key])) {
          dst[key] = deepClone_hash(src[key], hashMap);
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

/**
 * 版本四：用循环替代递归消除对象层级太深导致的栈溢出，但是仍然存在循环引用造成的死循环问题
 * 另一个问题是：造成了引用关系丢失，比如一个对象中的两个属性都指向了同一个引用对象，但是深拷贝后这两个属性指向的是两个不同的引用对象
 */
function deepClone_loop(src) {
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
    const stack = [{ parent: dst, value: src }];

    while(stack.length) {
      const node = stack.pop();
      const parent = node.parent;
      const value = node.value;

      for (let k in value) {
        if (value.hasOwnProperty(k)) {
          if (isObject(value[k])) {
            parent[k] = Array.isArray(value[k]) ? [] : {};
            stack.push({ parent: parent[k], value: value[k] });
          } else {
            parent[k] = value[k];
          }
        }
      }
    }
    return dst;
  } else {
    return src;
  }
}


function createData(deep, breadth) {
  var data = {};
  var temp = data;

  for (var i = 0; i < deep; i++) {
    temp = temp['data'] = {};
    for (var j = 0; j < breadth; j++) {
      temp[j] = j;
    }
  }

  return data;
}

let a = createData(10000000);
let b = deepClone_loop(a);

console.log(b)
