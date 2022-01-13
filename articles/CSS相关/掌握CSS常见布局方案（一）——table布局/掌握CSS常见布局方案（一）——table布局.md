# 掌握CSS常见布局方案

## CSS布局发展简介

<table>
    <thead>
        <tr style="font-weight: bold;">
            <td style="width: 20%">阶段</td>
            <td>布局方案</td>
            <td style="width: 50%">难易程度</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>早期</td>
            <td>以table布局为主</td>
            <td>简单（表格是一个方块形结构，可以方便的画出行列）</td>
        </tr>
        <tr>
            <td>中期</td>
            <td>以各种技巧性布局为主</td>
            <td>困难</td>
        </tr>
        <tr>
            <td>现在</td>
            <td>弹性布局/网格布局（flexbox/grid）</td>
            <td>比较简单</td>
        </tr>
    </tbody>
</table>


table布局在2007年之前，基本上属于是当时唯一的布局方案，并且简单易上手。中期table布局向技巧性布局的发展，是因为当时浏览器加载table不是以流式的方式，table越大，用户等待页面渲染的时间越长，体验非常不好。而现在这个问题基本不存在了，浏览器基本都是以流式来加载table的，所以table布局现在除了语义化不够清晰以外，没有特别突出的缺点了，也可以适当使用。

技巧性布局的困难之处在于，这些方法并不是为布局而生的，只是人们发现可以通过某些技巧使得它们为布局服务，所以理解和使用上会遇到一些困难，但它仍然是CSS布局的重点。

CSS布局发展到现在，为了处理技巧性布局中的一些困难点，规范推出了flexbox和grid两种布局方案，相对来说比较简单。

除了上述的布局方案，在当下移动端迅速发展的情况下，CSS布局还需要适配各种移动端设备、PC端、大屏、小屏等场景，所以前端工程师还需要掌握响应式布局的方法。



## table布局

table本身自带行和列，以及格子，所以在布局时使用起来很方便。

table布局中实际包含了两种方案：1、table相关标签布局；2、通过设置display的属性为table相关的值来布局。

### 通过原生table标签来实现table布局

早期基本上只能通过原生table标签来实现一些行列的布局，比如实现一个等宽三列布局：

```html
<html>
    <head></head>
    <body>
        <table>
            <tbody>
                <tr>
                    <td>左</td>
                    <td>中</td>
                    <td>右</td>
                </tr>
            </tbody>
        </table>
    </body>
</html>
```



### 通过设置display属性来实现table布局





### 原生table标签布局与display属性table布局的映射

<table>
    <thead>
        <tr style="font-weight: bold;">
            <td style="width: 25%;">HTML标签</td>
            <td style="width: 25%;">display属性</td>
            <td>说明</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>&lt;table&gt;</td>
            <td>table<br/>
                inline-table
            </td>
            <td></td>
        </tr>
        <tr>
            <td>&lt;thead&gt;</td>
            <td>table-header-group</td>
            <td></td>
        </tr>
        <tr>
            <td>&lt;tbody&gt;</td>
            <td>table-row-group</td>
            <td></td>
        </tr>
        <tr>
            <td>&lt;tfoot&gt;</td>
            <td>table-footer-group</td>
            <td></td>
        </tr>
        <tr>
            <td>&lt;tr&gt;</td>
            <td>table-row</td>
            <td></td>
        </tr>
        <tr>
            <td>&lt;td&gt;</td>
            <td>table-cell</td>
            <td></td>
        </tr>
        <tr>
            <td>&lt;col&gt;</td>
            <td>table-column</td>
            <td></td>
        </tr>
        <tr>
            <td>&lt;colgroup&gt;</td>
            <td>table-column-group</td>
            <td></td>
        </tr>
        <tr>
            <td>&lt;caption&gt;</td>
            <td>table-caption</td>
            <td></td>
        </tr>
    </tbody>
</table>

