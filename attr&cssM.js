/**
 * Created by lanlan on 2016/10/25.
 */
//��Ӿ�̬��������ȡԪ�ص�style
$.extend({
    getStyle: function (ele, styleName) {
        //�������Ĳ���һ��dom����ֱ�ӷ��أ���������
        if (!jQuery.isDom(ele)) {
            return;
        }
        //�����ݴ���
        if (window.getComputedStyle) {
            return getComputedStyle(ele)[styleName];
        } else {
            return ele.currentStyle[styleName];
        }
    }
});
$.fn.extend({
    /*
     * function{ hasClass }�ж�ָ����Ԫ�أ���û��class���������
     * param{ className: string }class������
     * return boolean
     *
     * ʵ��˼·��
     *   1���������е�Ԫ�أ�ֻҪ��һ��Ԫ�ش���ָ����className������true
     *   2�����û��һ��Ԫ����ָ����className����ķ���false
     *
     *   ((' ' + this.className + ' ').indexOf(' ' + this.className + ' ')) = -1 ˵����
     *   ��������ֵ��û��ǰ�����ֵ������һ����Ѱ�ķ�����
     *
     * */
    hasClass: function (className) {
        //�������е�Ԫ��
        for (var i = 0, len = this.length; i < len; i++) {
            //��������Ԫ��
            if (((' ' + this[i].className + ' ').indexOf(' ' + className + ' ')) > -1) {
                return true;
            }
        }
        return false;
    },
    /*
     * function{ addClass }�����е�Ԫ�����ָ����className
     * param{ className��string || undefined || null || ������ }��ӵ�ָ����className
     * return this ��Ϊ����ʽ��̣�
     *
     * ʵ��˼·��
     *   1�������Σ������κδ�������this
     *   2������null�������κδ�������this
     *   3������ undefined�������κδ�������this
     *   4������ ������������ӣ�����this
     *
     *   1���������е�Ԫ�أ�������û���������
     *   2������Ѿ���������ԣ������ӣ�û��������Ծ�������
     *   3������this
     * */
    addClass: function (className) {
        var len = arguments.length;

        if (len == 0 || className == null) {
            return this;
        }
        //�������е�Ԫ��
        this.each(function () {
            //������е�Ԫ��û�����className������ӣ����Ұ����Ŀո�ȥ��
            if (!jQuery(this).hasClass(className)) {
//                    this.className += '' + className;//��ȥ�ո������ôд
                this.className = (this.className + ' ' + className)
                    .replace(/^\s*|\s*$/g, '');
            }
        });
        return this;
    },
    /*
     * function{ removeClass }ɾ������Ԫ����ָ����className
     * param{ className:string || undefined || null ||��������}ָ����className
     * return this
     * ʵ��˼·��
     *  1����������������ֱ��ɾ�����е�classNameֵ
     *  2�������������������е�Ԫ�������classNameֵ�Ķ�ɾ��
     *  3��return this ����thisΪ����ʽ���
     *
     * */
    removeClass: function (className) {
        var len = arguments.length;

        //��������,ɾ�����е�className
        if (len == 0) {
            this.each(function () {
                this.className = '';
            });
        }
        //���������undefined������nullʱ
        if (className == null) {
            return this;
        }
        this.each(function () {
            //��������className������ֵ����Ϊ���ַ������������������ַ���
            if (jQuery(this).hasClass(className)) {
                this.className = (' ' + this.className + ' ').
                    replace(' ' + className + ' ', ' ')
                    .replace(/^\s*|\s*$/g, '');
            }
        });
        return this;
    },
    /*
     * function{ toggleClass }�л�className������о�ɾ����û�о����
     * param { className��string || undefined || null || ������}
     *
     * ����˼·��
     *   1������undefinedʱ��������е�classֵ������this
     *   2������nullʱ��������������this
     *   3������������������е�classֵ������this
     *   4�����������Ĳ���������о�ɾ����û�о����ã�����this
     * */
    toggleClass: function (className) {
        var len = arguments.length;
        //�����Σ����ߴ���Ĳ�����undefinedʱ������Ϊ���ַ���
        if (len == 0 || className === undefined) {
            this.each(function () {
                return this.className = '';
            });
        }
        //�������null����������ֱ�ӷ���this
        else if (className === null) {
            return this;
        }
        //������ʱ�򣬱������е�Ԫ�أ�����о�ɾ����û�о����ã�����this
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
     * function{ attr }��ȡ��һ��Ԫ�ء�����||ɾ������Ԫ�ص����Խڵ�ֵ
     * param{ name������ || null || undefined ||string ||object }���Խڵ���
     * param{ value : string }���Խڵ�ֵ
     * return this Ϊ����ʽ���
     *
     * ����ʵ�֣�
     *   1������undefined || null || �����Σ�������������this
     *   2������һ��ֵ�����ص��ǣ���ȡ���ǵ�һ��Ԫ�ص����Խڵ�ֵ
     *   3������һ�����ַ��������ص���undefined
     *   4��������һ������������Ϊ����ʱ���Ǹ����е�Ԫ���������е����Խڵ��ֵ
     *   5����������ֵ�������е�Ԫ���������Խڵ���Ϊname��ֵΪvalue
     *   6������this
     * */
    attr: function (name, value) {
        var len = arguments.length;
        //����undefined || null || �����Σ�������������this
        if (len == 0 || name == null) {
            return this;
        }
        //����Ĳ�������Ϊ1ʱ
        if (len == 1) {
            //������ַ���
            if (jQuery.isString(name)) {
                return this[0] && this[0].getAttribute(name);
            }
            //�������һ������
            else if (typeof  name == 'object') {
                this.each(function () {
                    var self = this;
                    jQuery.each(name, function (key, val) {
                        self.setAttribute(key, val);
                    })
                });

            }

        }
        //����Ĳ�������Ϊ2ʱ
        else if (len == 2) {
            this.each(function () {
                this.setAttribute(name, value);
            });
        }
        return this;
    },
    /*
     * function{ prop }��ȡԪ�ػ��߸�Ԫ���������Խڵ�
     * param{ name������ || null || undefined ||string ||object }���Խڵ���
     * param{ value : string }���Խڵ�ֵ
     * return this Ϊ����ʽ���
     *
     * 1��ʹ��һ�������洢arguments��length���ԣ�
     * 2�����lengthΪ1��nameΪ�ַ��������ȡ��һ��Ԫ��(this[0])�Ķ�Ӧ����ֵ
     * 3�����lengthΪ1��nameΪ�������������Ԫ�أ��ֱ���������ö������������õ����ԡ�
     * 4�����lengthΪ2�����������Ԫ�أ��ֱ���nameΪkey��valueΪֵ��������ԡ�
     * 5����������ã�return this�� ����ǻ�ȡ��return ����ֵ��
     * ���䣺prop�����û��ȡ���ԣ�������ҪԪ��.����������ȡ������Ԫ��.������ = ����ֵ�ķ��������á�
     * */
    prop: function (name, value) {
        var len = arguments.length;
        if (len == 0 || name == null) {
            return this;
        }
        //�������һ��ֵ
        if (len == 1) {
            //�����һ���ַ�����ֱ�ӷ��ص�һ��Ԫ�ص�����ֵ
            if (jQuery.isString(name)) {
                return this[0] && this[0][name];
            }
            //�����һ�����󣬱�����name������
            else if (typeof  name == 'object') {
                this.each(function () {
                    var self = this;
                    jQuery.each(name, function (key, val) {
                        self[key] = val;
                    });
                });
            }

        }
        //������������ֵ
        else if (len == 2) {
            this.each(function () {
                this[name] = value;
            });
        }
        return this;
    },
    /*
     * function { html }��ȡ��һ��Ԫ�ص�innerHTML�����ߣ����||���ã�����Ԫ�ص�innerHTML
     * param{ html: �������� || null || undefined || string}
     * return this Ϊ����ʽ���
     *
     * ʵ��˼·��
     *   1����������ʱ����ȡ�����ص��ǵ�һ��Ԫ�ص�html
     *   2������nullʱ��������е�innerHTML������this
     *   3������undefinedʱ�������κδ�������this
     *   4�����������ַ���ʱ��������Ԫ�ص�innerHTML��ֵ����Ϊ����Ĳ���������this
     *
     * */
    html: function (html) {
        var len = arguments.length;
        //�����Σ����ص�һ��Ԫ�ص�innerHTML
        if (len == 0) {
            return this.prop('innerHTML');
        }
        //����undefined����������ֱ�ӷ���this
        else if (len == 1 && html === undefined) {
            return this;
        }
        //����null��������������
        if (html === null) {
            html = '';
        }
        return this.prop('innerHTML', html);
    },

    /*
     * function { text }��ȡ����Ԫ�ص��ı����������������Ԫ�ص��ı�
     * param{ text: �������� || null || undefined || string}
     * return this Ϊ����ʽ���
     *  ʵ��˼·��
     *   1����������ʱ����ȡ����������Ԫ�ص��ı�
     *   2������nullʱ��������е�innerText������this
     *   3������undefinedʱ�������κδ�������this
     *   4�����������ַ���ʱ��������Ԫ�ص�innerText��ֵ����Ϊ����Ĳ���������this������ʶ���ǩ��
     * */
    text: function (text) {
        var len = arguments.length,
            result = '';
        //�����Σ���������Ԫ�ص��ı�
        if (len == 0) {
            this.each(function () {
                result += this.innerText
            });
            return result;
        }
        //����undefined����������ֱ�ӷ���this
        else if (len == 1 && text === undefined) {
            return this;
        }
        //����null��������������
        if (text === null) {
            text = '';
        }
        return this.prop('innerText', text);
    },
    /*
     * function{ css }��ȡ��һ��Ԫ�ص�ָ������ʽֵ����������������ʽֵ
     *  param { value: û�� || null || undefined || string }
     *
     *  ʵ��˼·��
     * 1����������Σ��򷵻�this
     * 2���������1������Ϊ�ַ������򷵻ص�һ��Ԫ�ص�ָ����ʽ
     * 3���������1������Ϊ�����������Ԫ�����������ʽ
     * 4���������2���������������Ԫ�����ָ������ʽ
     * */
    css: function (style, value) {
        var len = arguments.length;
        //��������
        if (len == 0) {
            return this;
        }
        //����һ������
        if (len == 1) {
            //�������һ���ַ��������ص�һ��Ԫ�ص�ָ����ʽ
            if (jQuery.isString(style)) {
                return jQuery.getStyle(this[0], style);
            }
            //����������һ������,�������Ԫ�����������ʽ
            else if (typeof  style == 'object') {
                this.each(function () {
                    var self = this;
                    jQuery.each(style, function (key, val) {
                        self.style[key] = val;
                    });
                });
            }

        }
        //������������
        else if (len == 2) {
            this.each(function () {
                this[style] = value;
            });
        }
        return this;
    },


});