

# 初识React的JSX

## JSX是什么

```jsx
const name = 'jsx';
const element1 = <div>这是一个{name}声明</div>;
const arr = [1, 2, 3, 4];
const element2 = arr.map(item => {
    return <div>序号是{item}</div>;         
});
```

**JSX是一个JavaScript的语法扩展，它具有JavaScript的全部功能。**

JSX的语法结合了js和类xml语法，简单来说：

声明的左边就是一个普通的js变量（可以用const、let、var等js允许的声明变量的方式）；

声明的右边是一个html代码块，里面可以使用任意的html标签来实现一段html代码块，有且只有一个最外层的父级元素。JSX表达式可以用一个圆括号包裹起来（只有一行html代码时可以不用圆括号，但是多行html代码时必须有，防止自动加上的分号）。还可以使用{}来插入任意变量，甚至是表达式。

语法上，JSX更接近于JavaScript，所以React DOM使用的是小驼峰命名来定义属性名称，比如className、tabIndex：

```jsx
const element = (
    <div>
        <input className="first" tabIndex="1" />
	    <input className="second" tabIndex="2" />
    </div>
);
```

本文想重点讨论的是React为什么要引入JSX，以及JSX的本质。对于基本语法不做过多描述，更多的语法细节可以参考：https://react.docschina.org/docs/introducing-jsx.html。



## React为什么要引入JSX

在前端的架构设计中，一直有一个**分离点原则**，也就是js、html、css三者尽量实现分离，这样的好处显而易见，可以独立开发和复用、抽取公共组件、抽取公共样式等。

要满足分离点原则，自然而然想到将UI、逻辑、样式拆分在不同的文件中，在页面开发时按需引入。比如在vue、angular框架开发组件时，一般都是将js、html、css分离在三个不同的文件中（vue是将js包装在.vue文件中）。

而React没有采用这种将js、html人为分离在不同文件中的方式，它是通过JSX（更准确地说法是React.createElement()，下文会有相应讲解），将逻辑和UI渲染放在同一组件中。

因为React认为：**引入模板是一种极其不佳的实现**。因为引入模板后，需要进入更多的概念，比如Vue和Angular中的模板语法、模板指令，通过这些附加概念来实现逻辑与UI的内在耦合，增加了学习成本。而JSX不需要引入其他东西，它仍然是JavaScript，只不过它支持类xml标签，然后通过Babel将JSX编译成纯JS。

总的来说，React和Vue/Angular是采用了不同的方式来实现的前端架构的分离点原则。



## JSX是一个语法糖，其本质是React.createElement()

**先思考下，如何用JavaScript对象来表示一个DOM结构？**

```html
<div class="parent">
    <div class="child" id="children1">
        第一个子元素
    </div>
    <div class="child" id="children2">
        第二个子元素
    </div>
    <div class="child" id="children3">
        第三个子元素
    </div>
</div>
```

用一个JavaScript对象来表示上面这段DOM结构：

```javascript
const domTree = {
    tag: 'div',
    className: 'parent',
    children: [
        {
            tag: 'div',
            id: 'children1',
            className: 'child',
            children: ['第一个子元素']
        },
        {
            tag: 'div',
            id: 'children2',
            className: 'child',
            children: ['第二个子元素']
        },
        {
            tag: 'div',
            id: 'children3',
            className: 'child',
            children: ['第三个子元素']
        }
    ]
};
```

可以看到，这样的JavaScript对象，并不能直观表示DOM树的层次结构，如果是再复杂一些、节点再多一些，这个JavaScript对象就会非常复杂，不如html清晰直观。

因此，React引入了JSX语法，让我们可以在JavaScript中像写html标签一样完成上面代码的工作。

```jsx
const domTree = (
    <div class="parent">
        <div class="child" id="children1">
            第一个子元素
        </div>
        <div class="child" id="children2">
            第二个子元素
        </div>
        <div class="child" id="children3">
            第三个子元素
        </div>
	</div>
);
```

这样一对比，是不是发现JSX非常符合写HTML的习惯，只需要学习下如何插入变量和表达式等，几乎没有额外的学习成本。



**再来了解，JSX仅仅是React.createElement()函数的语法糖**

React官方文档中，明确指出了JSX 仅仅只是 `React.createElement(type, props, ...children)` 函数的语法糖。任何的JSX表达式都可以转换成React.createElement()，正因如此，在React中也可以不使用JSX，直接用React.createElement()。

React.createElement()返回一个React元素对象，然后通过ReactDOM.render()函数将这个React元素对象渲染成DOM。

比如：

```jsx
class Demo extends React.Component {
  render() {
    return (
        <ul className="demo">
            <li id="child1">子节点1</li>
            <li id="child2">子节点2</li>
        </ul>
    );
  }
}
```

通过Babel工具在编译时将上面的JSX代码转换成下面的代码：

```javascript
class Demo extends React.Component {
    render() {
        /*
        ** 参数1表示要创建的标签元素，可以是标签，也可以是一个React组件
        ** 参数2是一个属性对象
        ** 参数3是一个不定长参数，表示各个子节点
        */
        return React.createElement('div', {className: 'demo'},
        	React.createElement('li', {id: 'child1'}, '子节点1'),
            React.createElement('li', {id: 'child2'}, '子节点2'));
  	}
}
```

有一个在线转换JSX的工具，可以更加清晰地看出JSX如何转换成React.createElement()的：

https://babeljs.io/repl/



## 最后

上文中在与Vue、Angular进行对比时，只是站在React的角度阐述JSX的设计思想，并不是要分出孰优孰劣。不同的web框架有各自的设计理念，有的人喜欢用模板，有的人喜欢JSX这种HTML in JavaScript。

再者，JSX也有自己的一些缺陷，比如没有浏览器原生支持，所以至少在一段时间内它不会成为规范，甚至还有人认为JSX类似于PHP、JSP，认为将HTML和JS杂糅在一起非常不好。

但是深入了解React这种“以JavaScript为中心”的设计思想，能帮助我们更好地学习和深入React。



