//添加dom方法
$.fn.extend({
    /*
     * function{ empty }清空指定实例中每一个元素的内容
     * 方法 指定元素.innerHTML=''
     * return{ this }为了实现链式编程
     * */
    empty: function () {
        this.each(function () {
            this.innerHTML = '';
        });
    },

    /*
     * function{ remove }删除指定实例中的每一个元素
     * 实现： this.parentNode.removeChild(this)
     *
     * */
    remove: function () {
        this.each(function () {
            this.parentNode.removeChild(this);
        });
    },
    /*
     * function{ appendTo }将自己添加给指定的实例的每一个元素
     * param { seletor : dom || jQuery实例 || 选择器}
     * return 一个存储添加元素的数组实例
     *
     * 具体实现：
     *   1、遍历每一个元素
     *   2、将自己添加给指定的实例的每一个元素
     *    2.1 当指定的元素不是第一个时，后面的元素只能是克隆的元素
     *    2.2 利用appendChild,将自己添加给指定的元素
     *   3、返回存储着所有添加数据的数组实例
     * */
    appendTo: function (selector) {
        var $selector = jQuery(selector),
            result = [], temp;
        this.each(function () {
            var self = this;
            $selector.each(function (index) {
                temp = index === 0 ? self : self.cloneNode(true);
                this.appendChild(temp);
                result.push(temp);
            });
        });
        return jQuery(result);
    },
    /*
     * function{ append }将指定的元素添加到自己元素里
     * param{ content: dom || 文本 || jQuery实例}
     * return this 返回的是一个this，即谁调用返回谁
     *
     * 具体思路：
     *     1、判断content是不是字符串，
     *       当是字符串的时候，直接累加放在自己实例的每一个元素里
     *     2、遍历所有的元素，借用appendTo方法，将其存入自己的元素里
     * */
    append: function (content) {
        if (jQuery.isString(content)) {
            this.each(function () {
                this.innerHTML += content;
            });
        } else {
            //把指定的元素添加给自己
            jQuery(content).appendTo(this);
        }
        return this;
    },
    /*
     * function{ prependTo }将自己添加给指定元素的最前面
     * param{ selector: dom || jQuery实例 ||选择器 }
     * return 存储着添加的所有的元素的数组实例
     * 具体实现：
     *     1、遍历所有的实例
     *     2、将自己的每一个元素添加给每一个指定元素的最前面
     *       2.1 注意1：当指定的元素为第一个元素时，添加的是自己的原元素，
     *           当指定元素不是第一个时候，只能添加自己克隆的元素
     *       2.2 注意2：由于是指定元素的第一个，所以使用：
     *       指定元素.insertBefore(自己，指定元素.firstChild)
     *     3、返回存储着添加的所有的元素的数组实例
     * */
    prependTo: function (selector) {
        var $selector = jQuery(selector),
            result = [], temp;
        this.each(function () {
            var self = this;
            $selector.each(function (index) {
                temp = index === 0 ? self : self.cloneNode(true);
                this.insertBefore(temp, this.firstChild);
                result.push(temp);
            });
        });
        return jQuery(result);
    },
    /*
     * function{ prepend }将指定实例的每一个元素，添加到自己元素里的最前面
     * param{ comtent :dom || jQuery实例 || 文本}
     * return this 谁调用返回谁
     *
     * 具体实现：
     *  1、当content为字符串时，直接累加添加到自己的元素里的最前面
     *  2、当不是字符串时，
     *    借用prependTo方法，将指定的元素添加到自己的元素里面的最前面
     * */
    prepend: function (content) {
        if (jQuery.isString(content)) {
            this.each(function () {
                this.innerHTML += content;
            });
        } else {
            //把指定元素添加给自己
            jQuery(content).prependTo(this);
        }
        return this;
    },

});

