/**
 * Toast & loading
 */
layui.define(['jquery', 'layer'], function (exports) {
    let layer = layui.layer;
    let $ = layui.jquery;
    let view = function () {
    }

    //加载动画
    view.loading = function () {
        this.laodv = layer.load(1);
    }

    //解除加载动画
    view.unloading = function () {
        layer.close(this.laodv)
    };

    //成功提示
    view.success = function (msg, func) {
        layer.msg(msg, {offset: '15px', icon: 1, time: 1500}, func);
    }
    //失败提示
    view.failed = function (msg, func) {
        layer.msg(msg, {offset: '15px', icon: 2, time: 1500}, func);
    }

    //警告弹窗
    view.waring = function (title, msg) {
        layer.alert(msg, {title: title}, function (index) {
            layer.close(index)
        });
    }
    //错误弹窗
    view.error = function (title, msg) {
        layer.alert(msg, {title: title}, function (index) {
            layer.close(index)
        });
    }

    //界面弹窗
    view.popup = function (options) {
        let success = options.success
        delete options.success;
        return layer.open($.extend({
            type: 1
            , title: '提示'
            , content: ''
            , id: 'system-view'
            , closeBtn: 1
            , success: function (layero, index) {
                typeof success === 'function' && success.apply(this, arguments);
            }
            }, options))
    };

    //删除弹窗
    view.del = function (obj, request, url, data, flag,fun) {
        layer.prompt({
            formType: 1
            , title: '敏感操作，请验证口令'
        }, function (value, index) {
            if (value === 'sa@123') {
                layer.close(index);

                layer.confirm('真的删除行么', function (index) {
                    if (!flag) {
                        obj.del()
                    }
                    $.post({
                        url: url,
                        data: data,
                        success: function (res) {
                            if (res.code === 200) {
                                view.success(res.msg,fun)
                            } else {
                                view.failed(res.msg)
                            }

                        },
                        error: function (res) {
                            view.failed(e)
                        }
                    })
                    layer.close(index);
                });
            } else {
                layer.msg('口令验证失败')
            }
        });
    }

    exports('view', view)
})