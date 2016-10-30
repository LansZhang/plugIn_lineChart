/**
 * Created by lanlan on 2016/10/25.
 */
//添加静态方法，获取元素的style
$.extend({
    getStyle: function (ele, styleName) {
        //如果传入的不是一个dom对象，直接返回，不作处理
        if (!jQuery.isDom(ele)) {
            return;
        }
        //做兼容处理
        if (window.getComputedStyle) {
            return getComputedStyle(ele)[styleName];
        } else {
            return ele.currentStyle[styleName];
        }
    }
});
$.fn.extend({
    /*
     * function{ hasClass }判断指定的元素，有没有class这个属性名
     * param{ className: string }class的名字
     * return boolean
     *
     * 实现思路：
     *   1、遍历所有的元素，只要有一个元素存在指定的className，返回true
     *   2、如果没有一个元素有指定的className，则的返回false
     *
     *   ((' ' + this.className + ' ').indexOf(' ' + this.className + ' ')) = -1 说明在
     *   后面的这个值里没有前面这个值（这是一个另寻的方法）
     *
     * */
    hasClass: function (className) {
        //遍历所有的元素
        for (var i = 0, len = this.length; i < len; i++) {
            //如果有这个元素
            if (((' ' + this[i].className + ' ').indexOf(' ' + className + ' ')) > -1) {
                return true;
            }
        }
        return false;
    },
    /*
     * function{ addClass }给所有的元素添加指定的className
     * param{ className：string || undefined || null || 不传参 }添加的指定的className
     * return this （为了链式编程）
     *
     * 实现思路：
     *   1、不传参，不做任何处理，返回this
     *   2、传入null，不做任何处理，返回this
     *   3、传入 undefined，不做任何处理，返回this
     *   4、传入 正常参数，添加，返回this
     *
     *   1、遍历所有的元素，看看有没有这个属性
     *   2、如果已经有这个属性，则无视；没有这个属性就在设置
     *   3、返回this
     * */
    addClass: function (className) {
        var len = arguments.length;

        if (len == 0 || className == null) {
            return this;
        }
        //遍历所有的元素
        this.each(function () {
            //如果所有的元素没有这个className，就添加，并且把最后的空格去除
            if (!jQuery(this).hasClass(className)) {
//                    this.className += '' + className;//不去空格可以这么写
                this.className = (this.className + ' ' + className)
                    .replace(/^\s*|\s*$/g, '');
            }
        });
        return this;
    },
    /*
     * function{ removeClass }删除所有元素中指定的className
     * param{ className:string || undefined || null ||不传参数}指定的className
     * return this
     * 实现思路：
     *  1、如果不传入参数，直接删除所有的className值
     *  2、如果传入参数，将所有的元素有这个className值的都删除
     *  3、return this 返回this为了链式编程
     *
     * */
    removeClass: function (className) {
        var len = arguments.length;

        //不传参数,删除所有的className
        if (len == 0) {
            this.each(function () {
                this.className = '';
            });
        }
        //当传入的是undefined或者是null时
        if (className == null) {
            return this;
        }
        this.each(function () {
            //如果有这个className，将此值设置为空字符串，并清除最后多余的字符串
            if (jQuery(this).hasClass(className)) {
                this.className = (' ' + this.className + ' ').
                    replace(' ' + className + ' ', ' ')
                    .replace(/^\s*|\s*$/g, '');
            }
        });
        return this;
    },
    /*
     * function{ toggleClass }切换className，如果有就删除，没有就添加
     * param { className：string || undefined || null || 不传参}
     *
     * 具体思路：
     *   1、传入undefined时，清空所有的class值，返回this
     *   2、传入null时，不做处理，返回this
     *   3、不传参数，清空所有的class值，返回this
     *   4、传入正常的参数，如果有就删除，没有就设置，返回this
     * */
    toggleClass: function (className) {
        var len = arguments.length;
        //不传参，或者传入的参数是undefined时，设置为空字符串
        if (len == 0 || className === undefined) {
            this.each(function () {
                return this.className = '';
            });
        }
        //传入的是null，不做处理，直接返回this
        else if (className === null) {
            return this;
        }
        //其他的时候，遍历所有的元素，如果有就删除，没有就设置，返回this
        else {
            this.each(function () {
                var $this = jQuery(this);
                if ($this.hasClass(className)) {
                    $this.removeClass(className);
                } else {
                    $this.addClass(className);
                }
            });

        }
        return this;
    },
    /*
     * function{ attr }获取第一个元素、设置||删除所有元素的属性节点值
     * param{ name：不传 || null || undefined ||string ||object }属性节点名
     * param{ value : string }属性节点值
     * return this 为了链式编程
     *
     * 具体实现：
     *   1、传入undefined || null || 不传参，不做处理，返回this
     *   2、传入一个值，返回的是：获取的是第一个元素的属性节点值
     *   3、传入一个空字符串，返回的是undefined
     *   4、当传入一个参数，参数为对象时，是给所有的元素设置所有的属性节点和值
     *   5、传入两个值，给所有的元素设置属性节点名为name，值为value
     *   6、返回this
     * */
    attr: function (name, value) {
        var len = arguments.length;
        //传入undefined || null || 不传参，不做处理，返回this
        if (len == 0 || name == null) {
            return this;
        }
        //传入的参数长度为1时
        if (len == 1) {
            //如果是字符串
            if (jQuery.isString(name)) {
                return this[0] && this[0].getAttribute(name);
            }
            //传入的是一个对象
            else if (typeof  name == 'object') {
                this.each(function () {
                    var self = this;
                    jQuery.each(name, function (key, val) {
                        self.setAttribute(key, val);
                    })
                });

            }

        }
        //传入的参数长度为2时
        else if (len == 2) {
            this.each(function () {
                this.setAttribute(name, value);
            });
        }
        return this;
    },
    /*
     * function{ prop }获取元素或者给元素设置属性节点
     * param{ name：不传 || null || undefined ||string ||object }属性节点名
     * param{ value : string }属性节点值
     * return this 为了链式编程
     *
     * 1、使用一个变量存储arguments的length属性，
     * 2、如果length为1，name为字符串，则获取第一个元素(this[0])的对应属性值
     * 3、如果length为1，name为对象，则遍历所有元素，分别给他们设置对象中所有配置的属性。
     * 4、如果length为2，则遍历所有元素，分别以name为key，value为值，添加属性。
     * 5、如果是设置，return this； 如果是获取，return 属性值。
     * 补充：prop是设置或获取属性，所以需要元素.属性名来获取，或者元素.属性名 = 属性值的方法来设置。
     * */
    prop: function (name, value) {
        var len = arguments.length;
        if (len == 0 || name == null) {
            return this;
        }
        //如果传入一个值
        if (len == 1) {
            //如果是一个字符串，直接返回第一个元素的属性值
            if (jQuery.isString(name)) {
                return this[0] && this[0][name];
            }
            //如果是一个对象，遍历所name，设置
            else if (typeof  name == 'object') {
                this.each(function () {
                    var self = this;
                    jQuery.each(name, function (key, val) {
                        self[key] = val;
                    });
                });
            }

        }
        //如果传入的两个值
        else if (len == 2) {
            this.each(function () {
                this[name] = value;
            });
        }
        return this;
    },
    /*
     * function { html }获取第一个元素的innerHTML，或者（清除||设置）所有元素的innerHTML
     * param{ html: 不传参数 || null || undefined || string}
     * return this 为了链式编程
     *
     * 实现思路：
     *   1、不传参数时，获取并返回的是第一个元素的html
     *   2、传入null时，清空所有的innerHTML，返回this
     *   3、传入undefined时，不做任何处理，返回this
     *   4、传入正常字符串时，将所有元素的innerHTML的值设置为传入的参数，返回this
     *
     * */
    html: function (html) {
        var len = arguments.length;
        //不传参，返回第一个元素的innerHTML
        if (len == 0) {
            return this.prop('innerHTML');
        }
        //传入undefined，不做处理，直接返回this
        else if (len == 1 && html === undefined) {
            return this;
        }
        //传入null或者正常的数据
        if (html === null) {
            html = '';
        }
        return this.prop('innerHTML', html);
    },

    /*
     * function { text }获取所有元素的文本、清除、设置所有元素的文本
     * param{ text: 不传参数 || null || undefined || string}
     * return this 为了链式编程
     *  实现思路：
     *   1、不传参数时，获取并返回所有元素的文本
     *   2、传入null时，清空所有的innerText，返回this
     *   3、传入undefined时，不做任何处理，返回this
     *   4、传入正常字符串时，将所有元素的innerText的值设置为传入的参数，返回this（不能识别标签）
     * */
    text: function (text) {
        var len = arguments.length,
            result = '';
        //不传参，返回所有元素的文本
        if (len == 0) {
            this.each(function () {
                result += this.innerText
            });
            return result;
        }
        //传入undefined，不做处理，直接返回this
        else if (len == 1 && text === undefined) {
            return this;
        }
        //传入null或者正常的数据
        if (text === null) {
            text = '';
        }
        return this.prop('innerText', text);
    },
    /*
     * function{ css }获取第一个元素的指定的样式值，或者批量设置样式值
     *  param { value: 没有 || null || undefined || string }
     *
     *  实现思路：
     * 1、如果不传参，则返回this
     * 2、如果传入1个参数为字符串，则返回第一个元素的指定样式
     * 3、如果传入1个参数为对象，则给所有元素批量添加样式
     * 4、如果传入2个参数，则给所有元素添加指定的样式
     * */
    css: function (style, value) {
        var len = arguments.length;
        //不传参数
        if (len == 0) {
            return this;
        }
        //传入一个参数
        if (len == 1) {
            //传入的是一个字符串，返回第一个元素的指定样式
            if (jQuery.isString(style)) {
                return jQuery.getStyle(this[0], style);
            }
            //如果传入的是一个对象,则给所有元素批量添加样式
            else if (typeof  style == 'object') {
                this.each(function () {
                    var self = this;
                    jQuery.each(style, function (key, val) {
                        self.style[key] = val;
                    });
                });
            }

        }
        //传入两个参数
        else if (len == 2) {
            this.each(function () {
                this[style] = value;
            });
        }
        return this;
    },


});