/**
 * Created by lanlan on 2016/10/27.
 */
    //添加静态方法
jQuery.extend({
    /*
     * function{ getXhr }获取xhr对象
     * */
    getXhr: function () {
        return new XMLHttpRequest();
    },
    //ajax默认的配置项
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
     * functoion{ urlStringify } 把数据转换成url格式的数据
     *
     * */
    urlStringify: function (data) {
        //定义一个空字符串，用于存放转换后的数据
        var result = '', key;
        if (!data) {
            return;
        }
        for (key in data) {
            result += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
        }
        //将最后一个&符号去除
        return result.slice(0, -1);
    },
    /*
     * functoion{ processConfig }用于处理数据
     * */
    processConfig: function (options) {
        var config = {};
        //1、合并配置项
        jQuery.extend(config, jQuery.ajaxSettings, options);
        //2、统一请求类型
        config.type = config.type.toUpperCase();
        //3、如果是GET方式，处理url,并且将data改成null
        if (config.type == 'GET') {
            //转换成url格式的数据
            config.url += '?' + jQuery.urlStringify(config.data);
            config.data = null;
        }
        //如果是POST格式，将数据转换成url格式
        else if (config.type == 'POST') {
            config.data = jQuery.urlStringify(config.data);
        }
        //把配置好的config返回出去
        return config;

    },
    /*
     * function{ ajax }
     * */
    ajax: function (options) {
        var config = {}, xhr;

        //根据用户传送的数据进行处理
        config = jQuery.processConfig(options);

        //创建对象
        xhr = jQuery.getXhr();
        //建立连接
        xhr.open(config.type, config.url, config.async);
        //如果是post方式提交
        if (config.type == 'POST') {
            xhr.setRequestHeader('Content-Type', config.contentType)
        }
        //监听事件
        xhr.onreadystatechange = function () {
            var successDate = null;
            //是不是请求完成
            if (xhr.readyState == 4) {
                config.complete();
                //是不是请求成功
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    /*
                     * 如果dataType为json，那么帮用户解析成js对象返回
                     * 如果dataType为script，那么棒用户把请求到的js执行掉，然后再返回这些js脚本
                     * 如果dataType为style，那么动态创建一个style标签，然后把加载的样式添加进去，最后放到head里，让样式生效
                     * 如果请求的是其他数据，则不做额外处理，原物返回
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
                                //eval可以动态执行字符串
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
        //发送数据
        xhr.send(config.data);
    }
});
