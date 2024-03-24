layui.define(["jquery",'view'], function (exports) {
    let $ = layui.jquery;
    let view = layui.view;
    let sms = function () {
    }

    sms.render = function (options) {
        let buttonElement = $(options.buttonElement);
        let valueElement = $(options.valueElement);
        let callback = typeof options.callback === 'function' ? options.callback : null;
        try {
            callback(valueElement.val())
            let time = 60;
            buttonElement.attr("disabled", "")
            buttonElement.addClass("layui-disabled")
            let interval = setInterval(function () {
                buttonElement.text("重新发送(" + time-- + ")")
                if (time <= 0) {
                    clearInterval(interval)
                    buttonElement.html("重新发送")
                    buttonElement.removeAttr("disabled")
                    buttonElement.removeClass("layui-disabled")
                }
            }, 1000);
        }catch (e){
            view.failed(e.message)
        }
    }
    exports("sms", sms)
})