/**
 * Created by lanlan on 2016/10/25.
 */
$.extend({
    /*
     * function{ addEvent }����¼�
     * param{ ele��string }�����Ԫ�أ�dom����
     * param{ type��string }�¼�������
     * param{ fn��function }�¼����
     * */
    addEvent: function (ele, type, fn) {
        var len = arguments.length;
        //1������ı�������������������ele������dom����,����ֱ�ӷ���
        if (len !== 3 && !jQuery.isDom(ele)) {
            return;
        }
        //2��������ִ������(Ϊ���Ͻ�)
        if (jQuery.isFunction(ele.addEventListener)) {
            return ele.addEventListener(type, fn);
        }
        //3�������ie8
        else {
            return ele.attachEvent('on' + type, fn);
        }
    },
    /*
     * function { removeEvent }ɾ��ָ��Ԫ�ص�ָ���¼����
     * param{ ele��string }�����Ԫ�أ�dom����
     * param{ type��string }�¼�������
     * param{ fn��function }�¼����
     * */
    removeEvent: function (ele, type, fn) {
        var len = arguments.length;
        //1������ı�������������������ele������dom����,����ֱ�ӷ���
        if (len !== 3 && !jQuery.isDom(ele)) {
            return;
        }

        //2��������ִ������
        if (jQuery.isFunction(ele.removeEventListener)) {
            return ele.removeEventListener(type, fn);
        }
        //3�������ie8
        else {
            return ele.detachEvent('on' + type, fn);
        }
    }
});
$.fn.extend({
    /*
     * function { on } ������Ԫ�ذ󶨶�Ӧ�¼����¼����
     * param { type: string } Ҫ�󶨵��¼�����
     * param { fn: Function } Ҫ�󶨵��¼����
     *
     * ʵ��˼·��
     *   1���������е�Ԫ��
     *   2���������Ԫ����û��$_event_cache���ԣ��������ʹ�ã�û�����ʼ��Ϊ{}
     *   3��Ȼ�󿴿�$_event_cache������û����type���������飬�������ʹ�ã�û�����ʼ��[]
     *   4��Ȼ���fn�洢��������飨$_event_cache������û����type���������飩��
     *   ע�⣺����ǵ�һ�θ�ĳ���¼�����push������
     *        ��ô����Ҫ�����һ��������Щ����ĺ����ĺ���
     * */
    on: function (type, fn) {
        //��������Ԫ��
        this.each(function () {
            //�ж�ÿһ��Ԫ������û�����$_event_cache�������û�о����һ������
            this.$_event_cache = this.$_event_cache || {};
            //�ж϶���������û����ôһ�����飬���û�о����һ��������
//                this.$_event_cache[type] = this.$_event_cache[type] || [];

            //�ж���û���������
            if (this.$_event_cache[type]) {
                //����������������Ӻ���
                this.$_event_cache[type].push(fn);
            } else {
                //˵��û��������飬˵��֮ǰû�а󶨹�������¼��������°��¼�
                (this.$_event_cache[type] = []).push(fn);
                //Ϊ�˼���ie8����ie8��
                var self = this;
                //��һ��Ԫ��ע���¼�
                jQuery.addEvent(this, type, function (e) {
                    //IE6��7��8���¼��������������this����û��ָ���¼�Դ��
                    // ���Բ���ʹ��this��ֻ���Ƚ������thisʹ�ñ�������������Ȼ������������
                    jQuery.each(self.$_event_cache[type], function () {
                        //�����������ÿһ������
                        this(e);
                    });
                })

            }


        });
        //Ϊ����ʽ���
        return this;
    },
    /*
     * function { off } ɾ������Ԫ��ָ�����¼����
     * param { type: string } Ҫɾ�����¼�����
     * param { fn: Function } Ҫɾ�����¼����
     *
     * ����˼·��
     *   1�����û�д��Σ�ɾ�������¼��Ĵ���������Ԫ�ص�$_event_cache����洢���¼������������ã�
     *   2���������һ����������ô�����Ӧ�¼��Ĵ���������Ԫ�ص�$_event_cache�����Ӧ�¼��ĺ����������ã�
     *   3���������������������ô�����Ӧ�¼��Ķ�Ӧ��������������Ӧ�¼������飬���κ�fn�Ƚϣ������ȣ���ô���������޳���
     * */
    off: function (type, fn) {
        var len = arguments.length, key, i;

        //����Ԫ��
        this.each(function () {
            var $_event_cache = this.$_event_cache;
            //�ж���û������������û��ֱ�ӷ���
            if (!$_event_cache) {
                return;
            }
            //û�д��Σ���Ԫ�ص�$_event_cache����洢���¼�������������
            if (len == 0) {
                for (key in $_event_cache) {
                    $_event_cache[key] = [];
                }
            }

            // �������һ����������Ԫ�ص�$_event_cache�����Ӧ�¼��ĺ�����������
            else if (len == 1) {
                $_event_cache[type] = [];
            }

            //�����������������������Ӧ�¼������飬���κ�fn�Ƚϣ������ȣ���ô���������޳�
            else if (len == 2) {
                //�ж���û���������
                if ($_event_cache[type]) {
                    //��������飬�����������
                    for (i = $_event_cache[type].length; i >= 0; i--) {
                        if ($_event_cache[type][i] == fn) {
                            $_event_cache[type].splice(i, 1);
                        }
                    }
                }
            }
        });

        //Ϊ����ʽ���
        return this;
    },

    /*/!*
     * function { click } ������Ԫ�ذ󶨵���¼�
     * param { fn: Function } �¼����
     * *!/
    click: function (fn) {
        return this.on('click', fn);
    }*/
});
//split(" ")���ַ���ת��������
var events = ( "blur focus focusin focusout load resize scroll unload click dblclick " +
"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
"change select submit keydown keypress keyup error contextmenu" ).split(" ");
jQuery.each(events, function (index, val) {
    $.fn[val] = function (fn) {
        return this.on(val, fn);
    }
});
