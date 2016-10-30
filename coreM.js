(function (window) {

    var version = "1.0.1";

    var document = window.document;

    //����
    var arr = [],
        push = arr.push,
        slice = arr.slice;

    //����
    var obj = {},
        toString = obj.toString,
        hasOwn = obj.hasOwnProperty;

    //��������
    function jQuery(selector) {
        return new init(selector);
    }

    //ԭ�ͱ���

    /*
     * jQueryԭ���еĺ��ĳ�Ա��
     * */

    jQuery.prototype = jQuery.fn = {
        jquery: version,
        constructor: jQuery,
        isReady: false,
        length: 0,
        /*
         * toArray:��ʵ��ת�������鷵��
         * */
        toArray: function () {
            return slice.call(this);
        },
        /*
         * get:��ȡָ���±��Ԫ�أ������Ǹ���������ȡ����
         * ��û�д�������ǣ������toArray��������
         * */
        get: function (num) {
            if (num == null) {
                return this.toArray();
            }
            return num >= 0 ? this[num] : this[this.length + num];
        },
        /*
         *
         * slice����ȡʵ���в���Ԫ�أ����¹����µ�ʵ������
         * ��jQuery()�������ʵ����slice.apply(this, arguments)��һ����ȡ��Ԫ��
         * */
        slice: function () {
            return jQuery(slice.apply(this, arguments));
        },
        /*
         * eq:ѡ��ָ���±��Ԫ�أ�����ѡ����������ȡ����
         * ���ѻ�ȡ����Ԫ�ط�װ���µ�ʵ������
         * */
        eq: function (num) {
            var dom;
            if (num == null) {
                return jQuery();
            }
            //�����ֵ���ͷ���ʵ��
            //���û��ֵ���ͷ���һ����ʵ��
            return (dom = this.get(num) ) ? jQuery(dom) : jQuery();
        },
        /*
         * first:ѡ��ָ������ĵ�һ��Ԫ��
         * last:ѡ��ָ����������һ��Ԫ��
         * */
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        /*
         * push:��ʵ������µ�Ԫ��
         * sort:��ʵ���е�Ԫ�ؽ�������
         * splice:��ָ���±�ɾ��ָ��������Ԫ�أ����ߴ�ָ���±��滻ָ��������Ԫ��
         * ��������
         * */
        push: push,
        sort: arr.sort,
        splice: arr.splice,
        /*
         * each:����ʵ�����е�Ԫ�أ��ѱ����������ݷֱ𴫸��ص�
         * map:����ʵ�����е�Ԫ�أ��ѱ����������ݷֱ𴫸��ص���Ȼ��ѻص��ķ���ֵ���һ�����鷵��
         * */
        each: function (callback) {
            return jQuery.each(this, callback);
        },
        map: function (callback) {
            return jQuery.map(this, callback);
        }


    };

    /*
     * ������һ��������ʱ���������copy�� this ����
     * ��������������ʱ�򣬺�������Ժ�����ֵ��copy����һ������
     * ͬʱ������������ԭ�����extend����
     * */
    jQuery.extend = jQuery.fn.extend = function () {
        /*
         * ����һ��target ����˭copy˭����target
         * Ĭ�������targetΪ��һ������
         *
         * */
        var key, i,
            arg = arguments,
            len = arguments.length,
            target = arg[0];
        // ����������һ����������ѵ�һ�����������Ժ�ֵcopy��this����
        // ��������һ��copy�����Ծ���˵target����this����ô�Ͱ�this��target
        if (len == 1) {
            target = this;
        }
        //�������еĲ�������������������Ժ�ֵ��copy����һ����������
        for (i = 0; i < len; i++) {
            for (key in arg[i]) {
                target[key] = arg[i][key]
            }
        }
    };

    //��Ӿ�̬����
    jQuery.extend({
        /*
         * isFunction:�ж��ǲ��Ǻ���
         * �ص㣺typeof fun === 'function'
         * */
        isFunction: function (fun) {
            return typeof fun === 'function';
        },
        /*
         * isWindow:�ж��ǲ���window
         * �ص㣺window.window=window;
         * !!����ת���ɲ���ֵ
         * */
        isWindow: function (win) {
            return !!win && !!window.win === win;
        },
        /*
         * isDom:�ж��ǲ���domԪ��
         * dom���ص�:dom����dom.nodeType����
         * */
        isDom: function (dom) {
            return !!dom && !!dom.nodeType;
        },
        /*
         * isString:�ж��ǲ����ַ���
         * �ص㣺typeof str =='string'
         * */
        isString: function (str) {
            return typeof str == 'string';
        },
        /*
         * isHTML:�ж��ǲ���html��ǩ
         * �ص㣺��<��ͷ����>��β����������Ϊ3
         * */
        isHTML: function (html) {
            return html[0] === '<' &&
                html.charAt(html.length - 1) === '>' && html.length >= 3;
        },
        /*
         * isLikeArray:�ж��ǲ������顢α����
         * �ص㣺
         * 1������length���ԣ�function��windowҲ��length����,Ҫ�ų���
         * 2��length-1��ֵ
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
         * ready:����׼��,���ie8�в�����DOMContentLoaded�¼�
         * ע�⣺DOMContentLoaded����֮�󣬱㲻���ڴ���
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
         * parseHTML:����html
         * 1������һ����ʱ��div
         * 2��ͨ��innerhtmlת����dom
         * 3������ʱ��div.children�׳�
         * */
        parseHTML: function (html) {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            return tempDiv.children;
        },
        /*
         * each:����ʵ�����е�Ԫ�أ��ѱ����������ݷֱ𴫸��ص�
         * 1����һ������һ���ص�����
         * 2���ж��Ƕ��������飬��ͬ�������в�ͬ�ı�������
         *  2.1��ʱ�����ʱ��ʹ����ͨ��for����
         *  2.2���Ƕ���ʱʹ��for in��������
         * 3���ѱ����������ݴ��ݸ��ص�
         * 4�����û��õ�ĳһ���Լ���Ҫ������֮�����������������ͨ��return false��������
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
         * map:����ʵ�����е�Ԫ�أ��ѱ����������ݷֱ𴫸��ص���
         * Ȼ��ѻص��ķ���ֵ���һ�����鷵��
         * 1������һ���յ����飬���ڴ�ű�����������
         * 2�����ݲ�ͬ�����ݣ��ò�ͬ�ı�����ʽ
         * 3�����ش������ݵ�����
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

    //���캯��
    var init = jQuery.fn.init = function (selector) {

        //1��null��undefined==>ֱ�ӷ���this
        if (!selector) {
            return this;
        }
        //2������==>��ӵ� DOMContentLoaded �¼��У�
        // DOMContentLoaded��ready�ĺ�����
        else if (jQuery.isFunction(selector)) {
            jQuery.ready(selector);
        }
        //3���ַ���==>html������dom��������ѡ����
        else if (jQuery.isString(selector)) {
            //html==>ת��֮���html��Ӹ�this
            if (jQuery.isHTML(selector)) {
                push.apply(this, jQuery.parseHTML(selector));
            } else {
                //ѡ����==>��ie8�ﲻ֧��querySelectorAll����취������try��
                // ÿһ�������Ӹ�this
                try {
                    push.apply(this, document.querySelectorAll(selector))
                } catch (e) {

                }
            }
        }
        //4��dom==>ֱ����Ӹ�this
        else if (jQuery.isDom(selector)) {
            push.call(this, selector);
        }
        //5�����顢α����==>ÿһ���Ӹ�this
        else if (jQuery.isLikeArray(selector)) {
            push.apply(this, slice.call(selector));
        }
        //6������==>ֱ����ӵ�this
        else {
            push.call(this, selector);
        }
    };

    //�����캯����ԭ�ͺ͹���������ԭ��һ��
    init.prototype = jQuery.fn;


    //��$��jQuery��©��ȥ
    window.$ = window.jQuery = jQuery;

    /*
     * ����첽���ܴ����¼�����
     * */
    $(function () {

    });
})(window);
