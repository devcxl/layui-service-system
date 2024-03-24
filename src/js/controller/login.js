layui.define(['jquery', 'form', 'view', 'api', 'common'], function (exports) {
    layui.link('style/login.css')//引入css
    let $ = layui.jquery;
    let api = layui.api;
    let view = layui.view;
    let form = layui.form;
    let common = layui.common

    common.getImageCaptcha($('#ImageCaptcha'))
    $('#ImageCaptcha').on("click", function () {
        common.getImageCaptcha($(this))
    })
    /**
     * 回车登录
     */
    $('body').on('keydown', function (event) {
        if (event.key && event.key === "Enter") {
            $('#login-submit').trigger('click')
        }
    });
    // 提交登陆表单
    form.on('submit(LoginForm)', function (obj) {
        // 判断勾选登录状态
        let apiUrl = obj.field.is_admin ? api.user.login : api.employee.login;
        $.ajax({
            url: apiUrl,
            type: 'post',
            data: obj.field,
            success: function (res) {
                if (res.code === 200) {
                    view.success(res.msg, function () {
                        location.href = '/'
                    });

                } else {
                    view.failed(res.msg);
                }
            },
            error(e) {
                view.error(e)
            }
        })
    });

    form.render();
    exports('login', {})
})