(function () {
    return typeof arguments;
})();

console.log(typeof arguments);
console.log(arguments);



var f = function g() {
    return 23;
};
//console.log( typeof g());  //error
console.log(typeof f() == 'number');



(function (x) {
    delete x;
    console.log(x);
    return x;
})(1);


var y = 1, x = y = typeof x;
console.log(x == undefined);



console.log(
    (function f(f) {
        return typeof f();
    })(function () { return 1; }));



var foo = {
    bar: function () {
        console.log('baz:', this.baz);
        return this.baz;
    },
    baz: 1
};


(function () {
    console.log('arguments[0]:', arguments[0]);
    return typeof arguments[0]();
})(foo.bar);



var foo = {
    bar: function () {
        return this.baz;
    },
    baz: 1
}
console.log(typeof (f = foo.bar)());
console.log(typeof (foo.bar)());





var f = (
    function f() {
        console.log(1);
        return "1";
    }
    ,
    function g() {
        console.log(2);
        return 2;
    }
)();
console.log(typeof f);




var x = 1;
if (function f2() { }) {
    console.log("f2:", typeof f2);
    x += typeof f2;
}
console.log(x);

if (
    function test(params) {

    })
    console.log(typeof test);



var x = [typeof x, typeof y][1];
console.log(x);
console.log(typeof typeof x);



with (function (x, undefined) { }) length;




function f3() { return this; }
console.log(new f3() instanceof f3);




console.log(
    (function f() {
        function f() { return 1; }
        return f();
        function f() { return 2; }
    })()
);


(function (foo) {
    console.log(foo.foo.bar);
    return typeof foo.bar;
})({ foo: { bar: 1 } });



(function () {

    /* can't delete `arguments`, since it has DontDelete */
    var t = 'tt'; 

    delete arguments; // false 
    typeof arguments; // "object" 

    /* can't delete function's `length`; it also has DontDelete */

    function f() { }
    console.log(f.length);
    delete f.length; // false 
    typeof f.length; // "number" 
    console.log(f.length);
})(); 