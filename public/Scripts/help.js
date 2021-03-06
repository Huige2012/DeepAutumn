

//function showtest(iii, eee) {
//    alert(iii+eee);
//}

//function doshowtest(fff) {
//    fff.call(3, 1, 2); 
//}

//doshowtest(showtest);


//function add(a, b) {
//    alert(a + b);
//}
//function sub(a, b) {
//    alert(a - b);
//}

////add.apply(sub, [3, 1]);
//add.call(); 



////实现继承
//function Animal(name) {
//    this.name = name;
//    this.showName = function () {
//        alert(this.name);
//    }
//} 
//function Cat(name) { 
//    Animal.call(this, [name]);
//    //Animal.call(this, name);  
//} 
//var cat = new Cat("Black Cat");
//cat.showName();


//function Class1() {
//    this.showTxt = function () { alert(this.name) }
//}
//var obj = new Object();
//obj.name = "test1"
//Class1.call(obj);
//obj.showTxt();//test1
//alert(obj.showTxt);//function(){alert(this.name)}


//function Class1() {
//    this.name = 'class1';//添加name值
//    this.showTxt = function () { alert(this.name) }
//}
//function Class2() {
//    this.name = 'class2';
//}
//var class2 = new Class2();
//Class1.apply(class2);
//alert(class2.showTxt);//function(){alert(this.name)}
//class2.showTxt();//class1


//function jsCall(oThis) {//这里的jsCall就是Call
//    var argsNew = [].slice.call(arguments, 1)
//    return this.apply(oThis, argsNew);
//}
//Function.prototype.jsCall = jsCall;


//function f1(a, b, c) {
//    alert(a);
//}

//function f2() {
//    alert(this.name);
//}

//var nf1 = new f1();
//nf1.jsCall(f2, 1, 2);




//function matchDemo() {
//    var s;
//    var re = new RegExp("d(b+)(d)", "ig");
//    var str = "cdbcBdbsbdbdz";
//    var arr = re.exec(str);
//    s = "$1 contains: " + RegExp.$1 + "\n";
//    s += "$2 contains: " + RegExp.$2 + "\n";
//    s += "$3 contains: " + RegExp.$3;
//    return (s);
//}

//matchDemo();




//apply的其他巧妙用法：
//看到这里，我就会觉得既然apply和call的用法差不多，那么为什么还同时存在这两种方法呢？完全可以丢掉一个呀。后来才发现一篇文章中讲到apply因为它所传参数为数组这一特点还有许多其他的妙用。

//a) Math.max 可以实现得到数组中最大的一项：

//因为Math.max 参数里面不支持Math.max([param1,param2]) 也就是数组，但是它支持Math.max(param1,param2,param3…)，所以可以根据apply的特点来解决 var max=Math.max.apply(null,array)，这样轻易的可以得到一个数组中最大的一项。(apply会将一个数组转换为一个参数接一个参数的传递给方法)

//这块在调用的时候第一个参数给了一个null，这个是因为没有对象去调用这个方法，只需要用这个方法帮助运算，得到返回的结果就行，所以直接传递了一个null过去。

//b) Math.min  可以实现得到数组中最小的一项：

//同样和 max是一个思想 var min=Math.min.apply(null,array)。

//c) Array.prototype.push 可以实现两个数组合并：

//同样push方法没有提供push一个数组，但是它提供了push(param1,param,…paramN) 所以同样也可以通过apply来转换一下这个数组，即:

//    var arr1=new Array("1","2","3");

//var arr2=new Array("4","5","6");

//Array.prototype.push.apply(arr1,arr2); 

//也可以这样理解，arr1调用了push方法，参数是通过apply将数组装换为参数列表的集合。

//d) 小结：通常在什么情况下,可以使用apply类似Math.min等之类的特殊用法:

//一般在目标函数只需要n个参数列表,而不接收一个数组的形式（[param1[,param2[,…[,paramN]]]]），可以通过apply的方式巧妙地解决这个问题。

 