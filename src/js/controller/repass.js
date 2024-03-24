/**
 * 重置密码模块
 * @author devcxl
 */
layui.define(['jquery', 'form', 'api', 'view'], function (exports) {
    let form = layui.form;
    let $ = layui.jquery;
    let view = layui.view;
    let api = layui.api;
    form.render()
    form.on('submit(repass-submit)', function (data) {
        $.post({
            url: api.common.repass,
            data: data.field,
            success: function (res) {
                if (res.data) {
                    view.success(res.msg, function () {
                        location.hash = '/logout'
                    })
                } else {
                    view.failed(res.msg)
                }
            }
        })
    })
    exports('repass', {})
})