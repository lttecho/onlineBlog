/**
 * 版本五：解决循环引用死循环、递归造成的栈溢出、引用关系丢失的问题
 */

function deepClone(src) {
  const isObject = (s) => {
    let type = typeof s === 'object';
    if (s === null) {
      type = false;
    }
    return type;
  }

  const hashMap = new WeakMap();

  if (isObject(src)) {
    const dst = Array.isArray(src) ? [] : {};
    const stack = [{ parent: dst, value: src }];
    while(stack.length) {
      const node = stack.pop();
      const parent = node.parent;
      const value = node.value;
      for (let k in value) {
        if (value.hasOwnProperty(k)) {
          if (isObject(value[k])) {
            if (hashMap.has(value[k])) {
              parent[k] = hashMap.get(value[k]);
            } else {
              parent[k] = Array.isArray(value[k]) ? [] : {};
              stack.push({ parent: parent[k], value: value[k] });
              hashMap.set(value[k], parent[k]);
            }
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

// 这里还存在的问题就是：如果拷贝对象的中的引用数据比较多的话，hashMap就会比较大
