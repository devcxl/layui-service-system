/**
 * 忘记密码模块
 * @author devcxl
 */
layui.define(['jquery', 'form', 'api', 'sms', 'view', 'storage', 'select', 'api', 'conf'], function (exports) {
    let $ = layui.jquery;
    let sms = layui.sms;
    let form = layui.form;
    let select = layui.select;
    let view = layui.view;
    let api = layui.api;
    /**
     * 下拉列表
     */
    select.render(
        "#FORGET_CompanyName",
        api.company.all,
        "id",
        "name",
        "请选择公司"
    )
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

    //提交
    form.on('submit(forget_submit)', function (obj) {
        $.post({
            url: api.employee.forget,
            data: obj.field,
            success: function (res) {
                if (res.code===200){
                    $("#forget").hide();
                    $("#repass").show();
                }else {
                    view.failed(res.msg)
                }
            }, error: function (res) {
                view.failed(res.msg)
            },
        })
        return false;
    });

    //提交表单
    form.on('submit(repass_submit)', function (obj) {
        $.post({
            url: api.employee.repass,
            data: obj.field,
            success: function (res) {
                view.success(res.msg, function () {
                    location.hash = '/login'
                });
            }, error: function (res) {
                view.failed(res.msg)
            },
        })
        return false;
    });
    form.render();
    exports('forget', {})


})