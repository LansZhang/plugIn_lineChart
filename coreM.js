(function (window) {

    var version = "1.0.1";

    var document = window.document;

    //数组
    var arr = [],
        push = arr.push,
        slice = arr.slice;

    //对象
    var obj = {},
        toString = obj.toString,
        hasOwn = obj.hasOwnProperty;

    //工厂函数
    function jQuery(selector) {
        return new init(selector);
    }

    //原型别名

    /*
     * jQuery原型中的核心成员：
     * */

    jQuery.prototype = jQuery.fn = {
        jquery: version,
        constructor: jQuery,
        isReady: false,
        length: 0,
        /*
         * toArray:将实例转化成数组返回
         * */
        toArray: function () {
            return slice.call(this);
        },
        /*
         * get:获取指定下标的元素，可以是负数（倒着取），
         * 当没有传入参数是，则调用toArray返回数据
         * */
        get: function (num) {
            if (num == null) {
                return this.toArray();
            }
            return num >= 0 ? this[num] : this[this.length + num];
        },
        /*
         *
         * slice：截取实例中部分元素，重新构成新的实例返回
         * 被jQuery()包裹变成实例，slice.apply(this, arguments)是一个截取的元素
         * */
        slice: function () {
            return jQuery(slice.apply(this, arguments));
        },
        /*
         * eq:选择指定下标的元素，可以选择负数（倒着取），
         * 最后把获取到的元素封装成新的实例返回
         * */
        eq: function (num) {
            var dom;
            if (num == null) {
                return jQuery();
            }
            //如果有值，就返回实例
            //如果没有值，就返回一个空实例
            return (dom = this.get(num) ) ? jQuery(dom) : jQuery();
        },
        /*
         * first:选择指定对象的第一个元素
         * last:选择指定对象的最后一个元素
         * */
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        /*
         * push:给实例添加新的元素
         * sort:对实例中的元素进行排序
         * splice:从指定下标删除指定数量的元素，或者从指定下标替换指定数量的元素
         * 方法借用
         * */
        push: push,
        sort: arr.sort,
        splice: arr.splice,
        /*
         * each:遍历实例所有的元素，把遍历到的数据分别传给回调
         * map:遍历实例所有的元素，把遍历到的数据分别传给回调，然后把回调的返回值组成一个数组返回
         * */
        each: function (callback) {
            return jQuery.each(this, callback);
        },
        map: function (callback) {
            return jQuery.map(this, callback);
        }


    };

    /*
     * 当传入一个参数的时候，这个参数copy给 this 对象
     * 当传入多个参数的时候，后面的属性和属性值都copy给第一个参数
     * 同时给工厂函数和原型添加extend方法
     * */
    jQuery.extend = jQuery.fn.extend = function () {
        /*
         * 定义一个target ，给谁copy谁就是target
         * 默认情况下target为第一个参数
         *
         * */
        var key, i,
            arg = arguments,
            len = arguments.length,
            target = arg[0];
        // 如果传入的是一个参数，则把第一个参数的属性和值copy到this当中
        // 由于下面一起copy，所以就是说target就是this，那么就把this给target
        if (len == 1) {
            target = this;
        }
        //遍历所有的参数，经后面参数的属性和值，copy到第一个参数里面
        for (i = 0; i < len; i++) {
            for (key in arg[i]) {
                target[key] = arg[i][key]
            }
        }
    };

    //添加静态方法
    jQuery.extend({
        /*
         * isFunction:判断是不是函数
         * 特点：typeof fun === 'function'
         * */
        isFunction: function (fun) {
            return typeof fun === 'function';
        },
        /*
         * isWindow:判断是不是window
         * 特点：window.window=window;
         * !!用来转换成布尔值
         * */
        isWindow: function (win) {
            return !!win && !!window.win === win;
        },
        /*
         * isDom:判断是不是dom元素
         * dom的特点:dom都有dom.nodeType属性
         * */
        isDom: function (dom) {
            return !!dom && !!dom.nodeType;
        },
        /*
         * isString:判断是不是字符串
         * 特点：typeof str =='string'
         * */
        isString: function (str) {
            return typeof str == 'string';
        },
        /*
         * isHTML:判断是不是html标签
         * 特点：以<开头，以>结尾，长度最少为3
         * */
        isHTML: function (html) {
            return html[0] === '<' &&
                html.charAt(html.length - 1) === '>' && html.length >= 3;
        },
        /*
         * isLikeArray:判断是不是数组、伪数组
         * 特点：
         * 1、都有length属性（function、window也有length属性,要排除）
         * 2、length-1有值
         * */
        isLikeArray: function (likeArray) {
            if (jQuery.isFunction(likeArray) || jQuery.isWindow(likeArray)) {
                return false;
            }
            return !!likeArray && typeof likeArray == 'object' &&
                'length' in likeArray &&
                (likeArray.length === 0 || [likeArray.length - 1] in likeArray);
        },
        /*
         * ready:函数准备,解决ie8中不兼容DOMContentLoaded事件
         * 注意：DOMContentLoaded触发之后，便不会在触发
         * */
        ready: function (fn) {
            if (jQuery.fn.isReady) {
                return fn();
            }
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', function () {
                    jQuery.fn.isReady = true;
                    fn();
                })
            } else if (document.attachEvent) {
                document.attachEvent('onreadystatechange', function () {
                    if (document.readyState === 'complete') {
                        jQuery.fn.isReady = true;
                        fn();
                    }
                })
            }
        },
        /*
         * parseHTML:解析html
         * 1、创建一个临时的div
         * 2、通过innerhtml转化成dom
         * 3、将临时的div.children抛出
         * */
        parseHTML: function (html) {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            return tempDiv.children;
        },
        /*
         * each:遍历实例所有的元素，把遍历到的数据分别传给回调
         * 1、传一个对象、一个回调函数
         * 2、判断是对象还是数组，不同的数据有不同的遍历方法
         *  2.1当时数组的时候使用普通的for遍历
         *  2.2当是对象时使用for in方法遍历
         * 3、把遍历到的数据传递给回调
         * 4、当用户得到某一个自己想要的数据之后不想继续遍历，可以通过return false结束遍历
         * */
        each: function (obj, callback) {
            var i = 0, len, key;
            if (jQuery.isLikeArray(obj)) {
                for (len = obj.length; i < len; i++) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }

                }
            } else {
                for (key in obj) {
                    if (callback.call(obj[key], key, obj[key]) === false) {
                        break;
                    }
                }
            }
            return obj;
        },
        /*
         * map:遍历实例所有的元素，把遍历到的数据分别传给回调，
         * 然后把回调的返回值组成一个数组返回
         * 1、定义一个空的数组，用于存放遍历到的数据
         * 2、根据不同的数据，用不同的遍历方式
         * 3、返回存有数据的数组
         * */
        map: function (obj, callback) {
            var result = [],
                i = 0, key, len, temp;
            if (jQuery.isLikeArray(obj)) {
                for (len = obj.length; i < len; i++) {
                    temp = callback(obj[i], i);
                    if (temp != null) {
                        result.push(temp);
                    }
                }
            } else {
                for (key in obj) {
                    temp = callback(obj[key], key);
                    if (temp != null) {
                        result.push(temp);
                    }
                }
            }
            return result;
        },

    });

    //构造函数
    var init = jQuery.fn.init = function (selector) {

        //1、null、undefined==>直接返回this
        if (!selector) {
            return this;
        }
        //2、函数==>添加到 DOMContentLoaded 事件中；
        // DOMContentLoaded在ready的函数里
        else if (jQuery.isFunction(selector)) {
            jQuery.ready(selector);
        }
        //3、字符串==>html解析成dom；或者是选择器
        else if (jQuery.isString(selector)) {
            //html==>转换之后的html添加给this
            if (jQuery.isHTML(selector)) {
                push.apply(this, jQuery.parseHTML(selector));
            } else {
                //选择器==>在ie8里不支持querySelectorAll解决办法是利用try，
                // 每一项店铺添加给this
                try {
                    push.apply(this, document.querySelectorAll(selector))
                } catch (e) {

                }
            }
        }
        //4、dom==>直接添加给this
        else if (jQuery.isDom(selector)) {
            push.call(this, selector);
        }
        //5、数组、伪数组==>每一项都添加给this
        else if (jQuery.isLikeArray(selector)) {
            push.apply(this, slice.call(selector));
        }
        //6、其他==>直接添加到this
        else {
            push.call(this, selector);
        }
    };

    //将构造函数的原型和工厂函数的原型一样
    init.prototype = jQuery.fn;


    //将$、jQuery暴漏出去
    window.$ = window.jQuery = jQuery;

    /*
     * 解决异步不能触发事件问题
     * */
    $(function () {

    });
})(window);
