/**
 * Created by lanlan on 2016/10/27.
 */
    //��Ӿ�̬����
jQuery.extend({
    /*
     * function{ getXhr }��ȡxhr����
     * */
    getXhr: function () {
        return new XMLHttpRequest();
    },
    //ajaxĬ�ϵ�������
    ajaxSettings: {
        url: location.href,
        type: "GET",
        async: true,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        timeout: 0,
        dataType: 'json',
        success: function () {
        },
        error: function () {
        },
        complete: function () {
        }
    },
    /*
     * functoion{ urlStringify } ������ת����url��ʽ������
     *
     * */
    urlStringify: function (data) {
        //����һ�����ַ��������ڴ��ת���������
        var result = '', key;
        if (!data) {
            return;
        }
        for (key in data) {
            result += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
        }
        //�����һ��&����ȥ��
        return result.slice(0, -1);
    },
    /*
     * functoion{ processConfig }���ڴ�������
     * */
    processConfig: function (options) {
        var config = {};
        //1���ϲ�������
        jQuery.extend(config, jQuery.ajaxSettings, options);
        //2��ͳһ��������
        config.type = config.type.toUpperCase();
        //3�������GET��ʽ������url,���ҽ�data�ĳ�null
        if (config.type == 'GET') {
            //ת����url��ʽ������
            config.url += '?' + jQuery.urlStringify(config.data);
            config.data = null;
        }
        //�����POST��ʽ��������ת����url��ʽ
        else if (config.type == 'POST') {
            config.data = jQuery.urlStringify(config.data);
        }
        //�����úõ�config���س�ȥ
        return config;

    },
    /*
     * function{ ajax }
     * */
    ajax: function (options) {
        var config = {}, xhr;

        //�����û����͵����ݽ��д���
        config = jQuery.processConfig(options);

        //��������
        xhr = jQuery.getXhr();
        //��������
        xhr.open(config.type, config.url, config.async);
        //�����post��ʽ�ύ
        if (config.type == 'POST') {
            xhr.setRequestHeader('Content-Type', config.contentType)
        }
        //�����¼�
        xhr.onreadystatechange = function () {
            var successDate = null;
            //�ǲ����������
            if (xhr.readyState == 4) {
                config.complete();
                //�ǲ�������ɹ�
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    /*
                     * ���dataTypeΪjson����ô���û�������js���󷵻�
                     * ���dataTypeΪscript����ô���û������󵽵�jsִ�е���Ȼ���ٷ�����Щjs�ű�
                     * ���dataTypeΪstyle����ô��̬����һ��style��ǩ��Ȼ��Ѽ��ص���ʽ��ӽ�ȥ�����ŵ�head�����ʽ��Ч
                     * �����������������ݣ��������⴦��ԭ�ﷵ��
                     * */
                    switch (config.dataType) {
                        case 'json':
                            try {
                                successDate = JSON.parse(xhr.responseText)
                            } catch (e) {
                                successDate = xhr.responseText;
                            }
                            ;
                            break;
                        case 'script':
                            try {
                                //eval���Զ�ִ̬���ַ���
                                eval(xhr.responseText);
                            } catch (e) {
                                successDate = xhr.responseText;
                            }
                            ;
                            break;
                        case 'style':
                            $('head').append($('<style></style>').html(xhr.responseText));
                            break;
                        default:
                            successDate = xhr.responseText;
                    }
                    config.success(successDate, xhr.statusText, xhr);
                } else {
                    config.error(xhr.statusText, xhr);
                }
            }
        };
        //��������
        xhr.send(config.data);
    }
});
