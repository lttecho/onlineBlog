# ES5的6种实现继承方法

## 方法一：构造函数继承

本质：通过改变父类构造函数中的this指向，来实现子类继承父类的属性（注意只能继承父类中的属性，不能继承父类原型链上的属性）

```javascript
	function Parent(name, age) {
    this.name = name; // 父类的属性
    this.age = age;
    this.showName = function() { // 也是父类的属性，只不过这个属性是一个函数
        console.log(this.name);
    }
}

Parent.prototype.showAge = function() { // 父类构造函数原型链上的方法，是所有父类的实例所共享的
    console.log(this.age);
}

function Child(name, age, sex) {
    Parent.call(this, name, age); // 要继承父类中的所有属性，就需要将父类构造函数的this指向当前的child
    this.sex = sex; // 这是子类自己的属性
}

let c1 = new Child('ltt', 20, 'female');
c1.showName(); // ltt
c1.showAge(); // Uncaught TypeError: c1.showAge is not a function
```

**具体分析：**c1.showName()能正确打印出c1实例的name属性，c1.showAge()会报错就是因为构造函数继承方法，只能继承父类自己的属性，而不能继承父类的原型链上的属性。



## 方法二：原型链继承

本质：通过改变子类构造函数的prototype的指向，将其指向父类的一个实例，因为父类的实例可以通过[[prototype]]找到父类构造函数的原型，所以子类的实例不仅可以继承父类的实例上的所有属性，还可以通过原型链继承父类构造函数原型上的所有属性。

```javascript
function Parent(name, age) {
    this.name = name;
    this.age = age;
    this.showName = function() {
        console.log(this.name);
    }
}

Parent.prototype.showAge = function() {
    console.log(this.age);
}

function Child(name, age, no) {
    this.no = no;
}

Child.prototype = new Parent(); // 这里可以给Parent构造函数传递name和age，但是这个name和age是挂在Parent的实例上的，也就是Child的原型上的，是所有Child实例的原型上的属性

let c2 = new Child('ly', 30, 123);
c2.showAge(); // undefined，但是是可以调用到Parent.prototype上的方法的
c2.showName(); // undefined，也可以调用到Parent实例上的方法的

// 这里还有一个问题，就是Child.prototype指向了Parent的一个实例，就会造成Child.prototype.constructor指向Parent，因为Child.prototype的constructor属性被重写了，向原型链上找，找到了Parent.prototype.constructor，也就是Parent构造函数
Child.prototype.constructor = Child; // 所以需要重新指向Child构造函数，这一行放在Child.prototype = new Parent();之后

```

**具体分析**：原型链继承的方式，使得子类的实例可以继承父类的所有属性，以及父类原型链上的所有属性，缺点一是无法传递子类实例的参数给父类的构造函数，所有c2.showAge()和c2.showName()这两个方法都能访问，但是函数体内部的name和age属性却是undefined；缺点二是父类中的引用类型属性是所有子类实例所共享的。因为上述的两个缺点，原型链继承一般不会单独使用。



## 方法三：组合继承（构造函数继承+原型链继承）

本质：既然构造函数继承和原型链继承正好互补，就可以组合起来利用，既能向父类构造函数传递参数，也可以继承父类及父类原型上的所有属性。

```javascript
function Parent(name, age) {
    this.name = name;
    this.age = age;
    this.showName = function() {
        console.log(this.name);
    }
}

Parent.prototype.showAge = function() {
    console.log(this.age);
}

function Child(name, age, no) {
    Parent.call(this, name, age);
    this.no = no;
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

let c3 = new Child('c3', 20, 111);
let c4 = new Child('c4', 30, 222);
c3.showName(); // c3
c3.showAge(); // 20
c4.showName(); // c4
c4.showAge(); // 30
```



## 方法四：原型式继承（与原型链继承相似）



## 方法五：寄生式继承



## 方法六：寄生组合式继承



