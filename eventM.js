/**
 * Created by lanlan on 2016/10/25.
 */
$.extend({
    /*
     * function{ addEvent }添加事件
     * param{ ele：string }传入的元素（dom对象）
     * param{ type：string }事件的类型
     * param{ fn：function }事件句柄
     * */
    addEvent: function (ele, type, fn) {
        var len = arguments.length;
        //1、传入的必须是三个参数，并且ele必须是dom对象,否则直接返回
        if (len !== 3 && !jQuery.isDom(ele)) {
            return;
        }
        //2、如果是现代浏览器(为了严谨)
        if (jQuery.isFunction(ele.addEventListener)) {
            return ele.addEventListener(type, fn);
        }
        //3、如果是ie8
        else {
            return ele.attachEvent('on' + type, fn);
        }
    },
    /*
     * function { removeEvent }删除指定元素的指定事件句柄
     * param{ ele：string }传入的元素（dom对象）
     * param{ type：string }事件的类型
     * param{ fn：function }事件句柄
     * */
    removeEvent: function (ele, type, fn) {
        var len = arguments.length;
        //1、传入的必须是三个参数，并且ele必须是dom对象,否则直接返回
        if (len !== 3 && !jQuery.isDom(ele)) {
            return;
        }

        //2、如果是现代浏览器
        if (jQuery.isFunction(ele.removeEventListener)) {
            return ele.removeEventListener(type, fn);
        }
        //3、如果是ie8
        else {
            return ele.detachEvent('on' + type, fn);
        }
    }
});
$.fn.extend({
    /*
     * function { on } 给所有元素绑定对应事件的事件句柄
     * param { type: string } 要绑定的事件类型
     * param { fn: Function } 要绑定的事件句柄
     *
     * 实现思路：
     *   1、遍历所有的元素
     *   2、看看这个元素有没有$_event_cache属性，有则继续使用，没有则初始化为{}
     *   3、然后看看$_event_cache对象有没有以type命名的数组，有则继续使用，没有则初始化[]
     *   4、然后把fn存储到这个数组（$_event_cache对象有没有以type命名的数组）里
     *   注意：如果是第一次给某个事件数组push函数，
     *        那么还需要额外绑定一个调用这些数组的函数的函数
     * */
    on: function (type, fn) {
        //遍历所有元素
        this.each(function () {
            //判断每一个元素里有没有这个$_event_cache对象，如果没有就添加一个对象
            this.$_event_cache = this.$_event_cache || {};
            //判断对象里面有没有这么一个数组，如果没有就添加一个空数组
//                this.$_event_cache[type] = this.$_event_cache[type] || [];

            //判断有没有这个数组
            if (this.$_event_cache[type]) {
                //往对象里的数组里，添加函数
                this.$_event_cache[type].push(fn);
            } else {
                //说明没有这个数组，说明之前没有绑定过这类的事件，给从新绑定事件
                (this.$_event_cache[type] = []).push(fn);
                //为了兼容ie8，在ie8里
                var self = this;
                //给一个元素注册事件
                jQuery.addEvent(this, type, function (e) {
                    //IE6、7、8绑定事件处理函数，里面的this，并没有指向事件源，
                    // 所以不能使用this，只能先将外面的this使用变量保存起来，然后在这里引用
                    jQuery.each(self.$_event_cache[type], function () {
                        //调用数组里的每一个函数
                        this(e);
                    });
                })

            }


        });
        //为了链式编程
        return this;
    },
    /*
     * function { off } 删除所有元素指定的事件句柄
     * param { type: string } 要删除的事件类型
     * param { fn: Function } 要删除的事件句柄
     *
     * 具体思路：
     *   1、如果没有传参，删除所有事件的处理函数（把元素的$_event_cache里面存储的事件函数数组重置）
     *   2、如果传入一个参数，那么解除对应事件的处理函数（把元素的$_event_cache里面对应事件的函数数组重置）
     *   3、如果传入两个参数，那么解除对应事件的对应处理函数（遍历对应事件的数组，依次和fn比较，如果相等，那么从数组中剔除）
     * */
    off: function (type, fn) {
        var len = arguments.length, key, i;

        //遍历元素
        this.each(function () {
            var $_event_cache = this.$_event_cache;
            //判断有没有这个对象，如果没有直接返回
            if (!$_event_cache) {
                return;
            }
            //没有传参：把元素的$_event_cache里面存储的事件函数数组重置
            if (len == 0) {
                for (key in $_event_cache) {
                    $_event_cache[key] = [];
                }
            }

            // 如果传入一个参数：把元素的$_event_cache里面对应事件的函数数组重置
            else if (len == 1) {
                $_event_cache[type] = [];
            }

            //如果传入两个参数：遍历对应事件的数组，依次和fn比较，如果相等，那么从数组中剔除
            else if (len == 2) {
                //判断有没有这个数组
                if ($_event_cache[type]) {
                    //有这个数组，遍历这个数组
                    for (i = $_event_cache[type].length; i >= 0; i--) {
                        if ($_event_cache[type][i] == fn) {
                            $_event_cache[type].splice(i, 1);
                        }
                    }
                }
            }
        });

        //为了链式编程
        return this;
    },

    /*/!*
     * function { click } 给所有元素绑定点击事件
     * param { fn: Function } 事件句柄
     * *!/
    click: function (fn) {
        return this.on('click', fn);
    }*/
});
//split(" ")将字符串转化成数组
var events = ( "blur focus focusin focusout load resize scroll unload click dblclick " +
"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
"change select submit keydown keypress keyup error contextmenu" ).split(" ");
jQuery.each(events, function (index, val) {
    $.fn[val] = function (fn) {
        return this.on(val, fn);
    }
});
