# Vuex状态管理

## 作用

- vue采用的是单向数据流的方式

  ![image-20220816164005866](.\单向数据流.png)

- 当多个组件需要共享状态时，会出现2种情况，一是多个视图依赖于同一个状态，二是多个视图的行为会变更同一个状态，这两种情况会破坏单向数据流的简洁性

- 对于多个视图依赖同一个状态的情况，需要由上至下地层层传递参数，进而导致嵌套的组件十分繁琐，并且无法在兄弟组件之间传递状态

- 对于多个视图的行为会变更同一个状态的情况，常用方案是父子组件直接引用，或者是子组件触发父组件的事件去变更

- 以上两种较为复杂的情况下，常用的state管理方案，都十分脆弱和难以维护，因此出现了Vuex这种集中式状态管理库

- Vuex是一个集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化的库



## 核心点

### Vuex架构

- Vuex的核心是一个store仓库，它包含了应用中的状态
- store和全局对象是不同的：
  - store中存储的状态对象是响应式的，组件从store中读取状态，若状态发生变化，相关的组件也会得到更新
  - 不能直接改变store中的状态，改变的唯一方式是显示提交mutation，因为只有这样Vuex才能跟踪到每一个状态的变化



### State

**Vuex使用的是单一状态树**

- 应用中所有组件使用到的状态都存储在同一个对象中，它是唯一数据源，每个应用也就只能有一个store实例
-  Vuex通过vue插件的方式将store实例从根组件注入到所有子组件中，这样子组件就可以通过this.$store来访问state

**mapState辅助函数**

- 使用mapState函数可以将多个state映射为计算属性（只是一种简化的写法）
- mapState函数返回的是一个对象，如果要与局部计算属性混合使用，只要将这个对象展开混入其他计算属性对象中即可



### Getter

**作用**

- 需要利用store中的state来生成一些新的状态时，如果多个组件都需要用到这个新的状态，要么各个组件中重复写一份代码，要么抽取公共函数调用——store中getter的作用就是为了能过方便的从state中派生出新的状态
- Getter可以看做是store中的计算属性

**使用方式**

- 通过属性访问（类似于计算属性，会缓存结果）

  - store对外暴露一个getters对象（类似于computed），其中的属性值会像计算属性一样被缓存结果，然后以访问属性的方式来访问这些值
  - 在组件中使用this.$store.getters.xxxx

  ```javascript
  getters: {
      getNewState(state, getters) {
          return getters.xxx;
      }
  }
  
  // 在组件中使用时
  this.$store.getters.getNewState
  ```

  

- 通过方法访问（每次都会去调用，不会缓存结果）

  - 可以通过让getter返回一个函数，来实现给getter传参

    ```javascript
    getters: {
        getNewState: (state) => {
            return (newState) => {
                return state.newState;
            }
        }
    }
    
    // 在组件中使用时
    this.$store.getters.getNewState('newState');
    ```



**mapGetters辅助函数**

- 作用：仅仅是将store中的getter映射到组件的局部计算属性

  ```javascript
  export default {
      computed: {
          ...mapGetters([
              'xxx1',
              'xxx2'
              ......
          ])
          // 或者
          ...mapGetters({
          	getxxx1: 'xxx1' // 取个别名
  	    })
      }
  }
  
  ```



### mutation

**作用**

- 更改store的state的**唯一方式**就是提交mutation

- mutation类似于事件：每个mutation都有一个字符串类型的事件类型和一个回调函数

  ```javascript
  const store = createStore({
      state: {
          count: 1
      },
      mutations: {
          add(state) {
              state.count++;
          }
      }
  })
  ```

- 但是不能直接调用mutations中的处理函数，mutations选项更像是一个事件注册，就是注册好某个事件，当这个事件被触发时就会调用对应的回调函数

- 那如何触发这个事件呢？需要使用**store.commit()**，比如store.commit('add')

**store.commit()与载荷（Payload）**

- store.commit函数还可以传递额外的参数，这个参数会传给mutations中对应的函数，这个额外的参数就称为mutation的载荷

  ```javascript
  const store = createStore({
      state: {
          count: 1
      },
      mutations: {
          add(state, n) {
              state.count += n;
          }
      }
  })
  
  // 触发add事件时
  store.commit('add', 10);
  ```

- 大多数情况下，载荷应该是一个对象，这样就可以包含多个字段了

**store.commit()与type**

- 这是另一种提交mutation的风格

  ```javascript
  store.commit({
      type: 'add',
      n: 10
  })
  // 这种方式是将整个对象作为载荷提交给mutation的
  ```



**mutation必须是同步函数（这一点与action是不同的，action中可以处理异步操作）**

- 为什么必须是同步函数？如果mutation中有异步操作，当mutation事件被触发时，异步操作还没有被调用，也不知道什么时候会被调用，就意味着state的改变是不可追踪的。



**mapMutations辅助函数**

在组件中提交mutation有2种方式：

- this.$store.commit('xxx')

- 使用mapMutations辅助函数将组件中的methods映射为store.commit调用

  ```javascript
  export default {
      methods: {
          ...mapMutations([
              'add',
              ......
          ])
      }
  }
  ```

  



**关于代码风格上的一点建议：使用常量来单独声明mutation中的事件类型**

- 可以使用常量替代mutation的事件类型，将这些事件类型声明为常量，并保存在单独一个文件中，这样既有利于linter工具检查，也利于多人协作的大型开发项目

  ```javascript
  // 单独的常量声明文件 types.js
  export const ADD_EVENT = 'add';
  
  // store.js
  import { ADD_EVENT } from 'types.js';
  const store = createStore({
      state: {
          count: 1
      },
      mutations: {
          [ADD_EVENT](state, n) {
              state.count += n;
          }
      }
  })
  ```

  

### Action（action中可以包含任意的异步操作）

**作用**

- Action提交的是mutation，而不是直接改变state
- Action可以包含任意的异步操作



**声明action**

- Action函数接受一个与store实例具有相同方法和属性的context对象！！！（context对象并不是store的实例）
- 通过调用context.commit()提交一个mutation
- 通过context.state和context.getters来获取state和getters

```javascript
const store = createStore({
    state: {
        count: 1
    },
    mutations: {
        add(state, n) {
            state.count += n;
        }
    },
    actions: {
        add(context, n) {
            context.commit('add', n);
        }
        // 或者简写
        add({ commit }, n) {
    		commit('add', n);
		}
    }
})
```



**分发action**

- action通过context.commit触发mutation，那又如何触action呢？使用store.dispatch来触发。

  ```javascript
  store.dispatch('add');
  ```

- 同样的，action也支持载荷方式和对象方式进行分发

  ```javascript
  // 载荷方式
  store.dispatch('add', {
      n: 10
  });
  
  // 对象方式
  store.dispatch({
      type: 'add',
      n: 10
  });
  ```

  

**在组件中触发action**

- 一种方式：使用this.$store.dispatch('add')

- 另一种方式：使用mapActions辅助函数将组件中的methods映射为store.dispatch

  ```javascript
  export default {
      methods: {
          ...mapActions([
              'add',
              ......
          ]);
          // 或者用别名
          ...mapActions({
              addAlias: 'add'    
          })
      }
  }
  ```

  

**组合多个action**

需求场景：

1、action通常是异步的，如何知道action什么时候结束呢？

2、如何组合多个action来实现更为复杂的操作呢？

- store.dispatch中可以处理action函数返回的Promise，并且store.dispatch也返回一个Promise

```javascript
actions: {
    actionA({ commit }) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commit('mutation_A');
                resolve();
            }, 2000);
        });
    },
    actionB({ dispatch, commit }) {
        return dispatch('actionA').then(() => {
            commit('mutation_B'); // 先等待actionA触发了mutation_A并返回之后，再触发mutation_B
        })
    }
}

// 使用async/await也是一样的
actions: {
    async actionA({ commit }) {
        commit('mutation_A', await getDataA())
    },
    async actionB({ dispath, commit }) {
        await dispatch('actionA');
        commit('mutation_B', await getDataB());
    }
}
```





### Module 

**作用**

- 如果一个应用中要存储的state越来越多，就会导致单一状态树越来越庞大，会导致state对象越来越臃肿，不好维护
- Module即是为了解决这个问题，也就是模块化的思想，但是要记住只有单一数据源，单一数据源与模块化并不冲突
- 将store切割成多个module，每个module拥有自己的state，getter，action，mutation，甚至可以嵌套子module

```javascript
const moduleA = {
    state: { ... },
    mutations: {},
    actions: {},
    getters: {}
}
    
const moduleB = {
    state: { ... },
    mutations: {},
    actions: {},
    getters: {}
}

const store = createStore({
    modules: {
        a: moduleA,
        b: moduleB
    }
})

store.state.a; // 获取moduleA中的state
store.state.b; // 获取moduleB中的state
```



**Module中的mutation、getter、action**

- mutation和getter中的第一个参数都是Module中的state对象
- 对于内部的action，局部状态通过context.state访问，根节点状态通过context.rootState访问
- 对于内部的getter，第三个参数是根节点状态rootState

**命名空间**

- 默认情况下，Module中的action和mutation仍然是注册在全局命名空间中的——这样可以使得多个Module对同一个action和mutation作出响应；Getter也默认注册在全局命名空间中，所以要注意不能在不同的、无命名空间的Module中定义两个相同的getter从而导致错误。
- 通过添加namespaced: true可以使得Module有单独的命名空间
- 