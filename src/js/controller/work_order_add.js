layui.define(["jquery", "form", "api", "view", 'select','layedit'], function (exports) {
    let $ = layui.jquery;
    let form = layui.form;
    let api = layui.api;
    let select = layui.select;
    let view = layui.view;
    let layedit = layui.layedit;

    let addTR = layedit.build('addTR')
    select.render('#companyId', api.company.all, 'id', 'name', '', '选择公司')
    select.render('#productId', api.product.list, 'id', 'name', '', '选择模块')

    
    /**
     * 选择公司回调
     */
    form.on('select(companyId)', function (data) {
        $('#employeeId').html("")
        $.get({
            url: api.employee.all,
            data: {'cid': data.value},
            success: function (res) {
                console.log(res.data)
                let html = '<option value="">请选择联系人</option>'
                for (const item in res.data) {
                    html += '<option value="' + res.data[item]['id'] + '">' + res.data[item]['name'] + '</option>'
                }
                $('#employeeId').html(html)
                form.render()
            }, error: function (res) {
                console.error(res)
            }
        })
    });


    /**
     * 内部人员添加工单
     */
    form.on('submit(workOrderAddMan)', function (data) {
        layedit.sync(addTR)
        data.field.content=layedit.getContent(addTR)
        $('button').attr("disabled",true);
        $('button').addClass('layui-disabled')
        $.post({
            url: api.workOrder.addMan,
            data: data.field,
            success: function (res) {
                if (res.code === 200) {
                    view.success(res.msg,function (){
                        location.reload();
                    })
                } else {
                    view.failed(res.msg)
                }
            }, compile: function (res) {
            }
        })
        return false;
    });

    /**
     * 外部人员添加工单
     */
    form.on('submit(workOrderAdd)', function (data) {
        layedit.sync(addTR)
        data.field.content=layedit.getContent(addTR)
        $.post({
            url: api.workOrder.add,
            data: data.field,
            success: function (res) {
                if (res.code === 200) {
                    view.success(res.msg, function () {
                        location.hash = "/workOrder/my"
                    })
                } else {
                    view.failed(res.msg)
                }
            }, error: function (res) {
                view.error(res.msg)
            }, compile: function (res) {

            }
        })
        return false;
    });

    exports('work_order_add', {})
})
