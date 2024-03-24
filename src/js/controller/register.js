/**
 * register
 * @author devcxl
 */
layui.define(['jquery', 'sms', 'form', 'api', 'view', 'api', 'select'], function (exports) {
    let $ = layui.jquery;
    let sms = layui.sms;
    let select = layui.select;
    let form = layui.form;
    let view = layui.view;
    let api = layui.api;

    $('#get_sms_code').on("click", function () {
        sms.render({
            buttonElement: '#get_sms_code',
            valueElement: '#phone',
            callback: function (value) {
                if (/^1[3456789]\d{9}$/.test(value.trim())) {
                    //提交请求到发送验证码
                    $.get({
                        url: api.common.smsCode,
                        data: {"phone": value},
                        success: function (res) {
                            layui.layer.msg(res.msg);
                        }, error: function (e) {
                            layui.layer.msg(e);
                        }
                    })
                } else {
                    throw new Error("请输入正确的手机号");
                }
            }
        })
    })
    /**
     * 下拉列表
     */
    select.render(
        "#reg_companyname",
        api.company.all,
        "id",
        "name",
    )

    //提交注册表单
    form.on('submit(reg_submit)', function (obj) {
        $.post({
            url: api.employee.reg,
            data: obj.field,
            success: function (res) {
                view.success(res.msg, function (res) {
                    location.hash = '/login'
                });
            }, failed: function (res) {
                view.failed(res.msg)
            },
        })
        return false;
    });
    form.render();

    exports('register',{})
})