# CSS动画

## 动画分类

CSS中的动画分为两种：

- 过渡动画（补间动画）——transition
- 关键帧动画——animation



## 过渡动画：CSS transition

在CSS3引入transition属性之前，CSS是没有时间轴的概念的，所有的属性变化都是一瞬间的。

引入transition后，可以指定属性状态变化的时间。

```css
.test {
  width: 200px;
  height: 200px;
  background-color: red;
  transition: width 5s, background-color 3s; // 指定两个变化属性，width从200px经过5s变化到1000px，background-color从red经过3s变化到blue
}
.test:hover {
  width: 1000px;
  background-color: blue;
}
```

![img](.\变化1.gif)

### 只需要指定变化开始和结束的属性值，中间过程的变化过程是浏览器自己计算实现的

过渡动画又称为补间动画，跟flash的补间动画是一个意思，只需要指定变化开始和结束的属性值，中间的变化过程，由浏览器自动计算补全。



### 不是所有的属性值都可以有过渡动画，只有可计算的属性值才能有过渡动画

不是所有的属性状态都可以有过渡动画，只有可以“计算”的属性值才能有过渡动画。

哪些属性可以添加动画？

> 颜色：color/background-color/border-color/outline-color等
>
> 位置/平移：left/right/top/bottom/transform（平移）
>
> 长宽/大小/缩放：width/height/border-width/margin/border/font-size/line-height/transform（缩放）
>
> 数字型：opacity/font-weight/z-index
>
> 其他-线性变换（transform）

其他具体值见：https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_animated_properties‘



### 应避免在auto值上做动画

auto的值常常比较复杂，规范指出不要再它上面做动画。但是这个跟浏览器的具体实现有关系，有的浏览器支持auto上的动画，有的不支持，因为auto上的动画效果不可预期，应当避免使用。



### transition属性

- transition-property：指定过渡属性

  > transition-property: none; // 无
  >
  > transition-property: all; // 所有可以添加过渡动画的属性
  >
  > transition-property: <transition-property>; // 可以添加过渡动画的属性

- transition-duration：过渡的时长，可以指定所有属性的过渡时长，也可以分别指定每个属性的过渡时长，单位是秒或者毫秒

  > /* <time> 值 */
  > transition-duration: 6s; // 该值为单值时，所有的过渡属性都对应同样时间
  > transition-duration: 120ms;
  > transition-duration: 1s, 15s;
  > transition-duration: 10s, 30s, 230ms; // 该值为多值时，过渡属性按照transition-property顺序对应顺序时间
  >
  > /* 全局值 */
  > transition-duration: inherit;
  > transition-duration: initial;
  > transition-duration: unset;

- transition-delay：表示动画的延迟时间，即多长时间之后开始动画，单位是秒或者毫秒

  > /* <time> 值 */
  > transition-delay: 6s; // 该值为单值时，所有的过渡属性都对应同样时间
  > transition-delay: 120ms;
  > transition-delay: 1s, 15s;
  > transition-delay: 10s, 30s, 230ms; // 该值为多值时，过渡属性按照transition-property顺序对应顺序时间

- transition-timing-function：运动函数，定义属性值怎么变化（中间值怎么变化）。

  > transition-timing-function: cubic-bezier(*n*,*n*,*n*,*n*); // 贝塞尔曲线函数，在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值
  >
  > transition-timing-function: linear; // 匀速，相当于cubic-bezier(0,0,1,1)
  >
  > transition-timing-function: ease; // 慢速->变快->慢速，相当于cubic-bezier(0.25,0.1,0.25,1)
  >
  > transition-timing-function: ease-in; // 以慢速开始，相当于cubic-bezier(0.42,0,1,1)
  >
  > transition-timing-function: ease-out; // 以慢速结束，相当于cubic-bezier(0,0,0.58,1)
  >
  > transition-timing-function: ease-in-out; // 以慢速开始和结束，相当于cubic-bezier(0.42,0,0.58,1)

  有很多在线工具，能够生成各种贝塞尔曲线函数，比如https://cubic-bezier.com/#.17,.67,.83,.67

推荐简写语法：

> ```
> transition: <property> <duration> <timing-function> <delay>;
> 
> transition: width 2s ease-in 0s, background-color: 5s ease-in 3s; // 多个属性值可以用逗号分割
> ```



### transition的局限性

- 只能应用于可计算中间过程的属性。
- 必须要有触发条件，也就是说不能主动触发，只能被动触发（不能在页面加载时触发）。
- transition动画是一次性的，不能设置循环。
- 只能定义开始和结束时的两个状态，不能定义中间状态。



## 关键帧动画——animation

关键帧动画的出现就是为了弥补过渡动画的局限性。

animation动画包括两个部分：配置动画细节（描述动画的样式规则）；使用keyframes定义动画序列（指定动画开始、结束、中间关键帧）。

### animation属性（配置动画细节）

使用animation或者它的子属性，可以配置动画时间、时长及其他动画细节，但是该属性不能配置动画的具体表现。

- animation-name： 设置@keyframes动画的名称

- animation-duration：设置动画一个周期的时长，单位是秒或者毫秒。

- animation-timing-function：设置动画的运动曲线函数，同transition的一样

- animation-delay：动画延时时间，单位是秒或者毫秒。

- animation-iteration-count：定义动画在结束前运行的次数

  > animation-iteration-count: 1; // 默认值为1，可以用小数定义循环，来播放动画周期的一部分：例如，0.5将播放到动画周期的一半。不可为负值。
  >
  > animation-iteration-count: infinite; // 无限循环播放动画

- animation-direction：设置动画是否反向播放。

  >animation-direction: normal; // 默认值，动画结束后重置到起点
  >
  >animation-direction: reverse; // 反向运行动画
  >
  >animation-direction: alternate; // 动画交替正方向运行。反向时，动画按步回退，同时带有时间功能的函数也反向，比如ease-in变成ease-out
  >
  >animation-direction: alternate-reverse; // 反向交替，反向开始交替（第一次运行时是反向的，然后下一次是正向，依次循环）

- animation-fill-mode：设置CSS动画在执行之前和之后如何将样式应用于其目标

  > animation-fill-mode: none; // 当动画未执行时，动画不会将任何样式应用于目标
  >
  > animation-fill-mode: forwards; // 当动画完成后，保持最后一个属性值（在最后一个关键帧中定义）
  >
  > animation-fill-mode: backwards; // 在 animation-delay 所指定的一段时间内，在动画显示之前，应用开始属性值（在第一个关键帧中定义）
  >
  > animation-fill-mode: both; // 动画将遵循`forwards`和`backwards`的规则，从而在两个方向上扩展动画属性

- animation-play-state：定义一个动画是否运行或者暂停。可以通过查询它来确定动画是否正在运行。另外，它的值可以被设置为暂停和恢复的动画的重放。

  > animation-play-state：running; // 当前动画正在运行，默认值
  >
  > animation-play-state：pause; // 当前动画已停止



### keyframes（定义动画序列）

通过@keyframes建立两个或者两个以上关键帧来实现定义动画序列，每一个关键帧都描述了在给定时间点上如何渲染。

关键帧使用百分比来指定动画发生的时间点，0%是第一时间点，100%是最终时间点，这两个时间点还有别名from和to。



## CSS动画与JS动画的区别





