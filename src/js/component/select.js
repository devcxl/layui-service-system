layui.define(["jquery", "form"], function (exports) {
    let $ = layui.jquery;
    let form = layui.form;
    let selector = function () {
    }

    selector.render = function (element, url, key, value,defaultValue,tip) {
        element = $(element);
        if (!element){
            return
        }
        url = url || element.data(`url`)
        key = key || element.data(`key`)
        value = value || element.data(`value`)
        defaultValue = defaultValue || element.data(`defaultValue`) || ''
        tip = tip ||element.data(`tip`)|| ''

        $.get({
            url: url,
            success: function (res) {
                let html = '<option value="">'+tip+'</option>'
                for (const item in res.data) {
                    if (res.data[item][key]===defaultValue) {
                        html += '<option selected value="' + res.data[item][key] + '">' + res.data[item][value] + '</option>'
                    }else {
                        html += '<option value="' + res.data[item][key] + '">' + res.data[item][value] + '</option>'
                    }

                }
                element.html(html)
                form.render()
            }, error: function (res) {
                console.error(res)
            }
        })
    }


    exports("select", selector)
})