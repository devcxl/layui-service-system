layui.define(['form', 'jquery', 'api', 'sms', 'view'], function (exports) {
    let $ = layui.jquery;
    let api = layui.api;
    let form = layui.form;
    let sms = layui.sms;
    let view = layui.view;

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

    form.on("submit(reg_submit_company)", function (data) {
        $.post({
            url: api.company.reg,
            data: data.field,
            success: function (res) {
                view.success(res.msg, function () {
                    if (res.code === 200) {
                        location.hash = "/login"
                    }
                })
            }, error: function (e) {
                view.error(e.message)
            }
        })
    })
    form.render()
    exports('join', {})
})