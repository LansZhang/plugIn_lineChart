//���dom����
$.fn.extend({
    /*
     * function{ empty }���ָ��ʵ����ÿһ��Ԫ�ص�����
     * ���� ָ��Ԫ��.innerHTML=''
     * return{ this }Ϊ��ʵ����ʽ���
     * */
    empty: function () {
        this.each(function () {
            this.innerHTML = '';
        });
    },

    /*
     * function{ remove }ɾ��ָ��ʵ���е�ÿһ��Ԫ��
     * ʵ�֣� this.parentNode.removeChild(this)
     *
     * */
    remove: function () {
        this.each(function () {
            this.parentNode.removeChild(this);
        });
    },
    /*
     * function{ appendTo }���Լ���Ӹ�ָ����ʵ����ÿһ��Ԫ��
     * param { seletor : dom || jQueryʵ�� || ѡ����}
     * return һ���洢���Ԫ�ص�����ʵ��
     *
     * ����ʵ�֣�
     *   1������ÿһ��Ԫ��
     *   2�����Լ���Ӹ�ָ����ʵ����ÿһ��Ԫ��
     *    2.1 ��ָ����Ԫ�ز��ǵ�һ��ʱ�������Ԫ��ֻ���ǿ�¡��Ԫ��
     *    2.2 ����appendChild,���Լ���Ӹ�ָ����Ԫ��
     *   3�����ش洢������������ݵ�����ʵ��
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
     * function{ append }��ָ����Ԫ����ӵ��Լ�Ԫ����
     * param{ content: dom || �ı� || jQueryʵ��}
     * return this ���ص���һ��this����˭���÷���˭
     *
     * ����˼·��
     *     1���ж�content�ǲ����ַ�����
     *       �����ַ�����ʱ��ֱ���ۼӷ����Լ�ʵ����ÿһ��Ԫ����
     *     2���������е�Ԫ�أ�����appendTo��������������Լ���Ԫ����
     * */
    append: function (content) {
        if (jQuery.isString(content)) {
            this.each(function () {
                this.innerHTML += content;
            });
        } else {
            //��ָ����Ԫ����Ӹ��Լ�
            jQuery(content).appendTo(this);
        }
        return this;
    },
    /*
     * function{ prependTo }���Լ���Ӹ�ָ��Ԫ�ص���ǰ��
     * param{ selector: dom || jQueryʵ�� ||ѡ���� }
     * return �洢����ӵ����е�Ԫ�ص�����ʵ��
     * ����ʵ�֣�
     *     1���������е�ʵ��
     *     2�����Լ���ÿһ��Ԫ����Ӹ�ÿһ��ָ��Ԫ�ص���ǰ��
     *       2.1 ע��1����ָ����Ԫ��Ϊ��һ��Ԫ��ʱ����ӵ����Լ���ԭԪ�أ�
     *           ��ָ��Ԫ�ز��ǵ�һ��ʱ��ֻ������Լ���¡��Ԫ��
     *       2.2 ע��2��������ָ��Ԫ�صĵ�һ��������ʹ�ã�
     *       ָ��Ԫ��.insertBefore(�Լ���ָ��Ԫ��.firstChild)
     *     3�����ش洢����ӵ����е�Ԫ�ص�����ʵ��
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
     * function{ prepend }��ָ��ʵ����ÿһ��Ԫ�أ���ӵ��Լ�Ԫ�������ǰ��
     * param{ comtent :dom || jQueryʵ�� || �ı�}
     * return this ˭���÷���˭
     *
     * ����ʵ�֣�
     *  1����contentΪ�ַ���ʱ��ֱ���ۼ���ӵ��Լ���Ԫ�������ǰ��
     *  2���������ַ���ʱ��
     *    ����prependTo��������ָ����Ԫ����ӵ��Լ���Ԫ���������ǰ��
     * */
    prepend: function (content) {
        if (jQuery.isString(content)) {
            this.each(function () {
                this.innerHTML += content;
            });
        } else {
            //��ָ��Ԫ����Ӹ��Լ�
            jQuery(content).prependTo(this);
        }
        return this;
    },

});

