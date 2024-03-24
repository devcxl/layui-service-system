/**
 * employee
 * @author devcxl
 */
layui.define(['table', 'jquery', 'form', 'api', 'view', 'select'], function (exports) {
    let $ = layui.jquery
    let api = layui.api
    let table = layui.table
    let select = layui.select
    let form = layui.form
    let view = layui.view
    let url = layui.url();

    /**
     * 详细信息
     * @param data
     */
    let details = function (data) {
        view.popup({
            title: '详细信息'
            , area: ['700px', '300px']
            , id: 'employee-details-view'
            , success: function (layero) {
                layero.find('#employee-details-view').load('/view/employee/form.html', null, function () {
                    layero.find('#employee-form-div-submit').hide()
                    $.get({
                        url: api.employee.info,
                        data: {'id': data.id},
                        success: function (res) {
                            form.val('employee-view-from', res.data)
                            form.render()
                        }
                    })
                })
            }
        })
    }
    /**
     * 编辑信息
     * @param data
     */
    let edit = function (data) {
        view.popup({
            title: '编辑'
            , area: ['700px', '400px']
            , id: 'employee-update-view'
            , success: function (layero, index) {
                layero.find('#employee-update-view').load('/view/employee/form.html', null, function () {
                    $.get({
                        url: api.employee.info,
                        data: {'id': data.id},
                        success: function (res) {
                            form.val('employee-view-from', res.data)
                            form.render()
                        }
                    })

                    //提交操作
                    form.on('submit(employee-update)', function (data) {
                        let field = data.field; //获取提交的字段
                        $.post({
                            url: api.employee.update,
                            data: field,
                            success: function (res) {
                                view.success(res.msg);
                                if (res.code === 200) {
                                    view.success(res.msg)
                                } else {
                                    view.failed(res.msg)
                                }
                            },
                            complete: function () {
                                layui.table.reload('employee-table'); //重载表格
                            }
                        })
                        layer.close(index); //执行关闭
                        return false;
                    });
                })
            }
        })
    }
    console.debug(url)

    let apiUrl = ''
    if (url.hash.href === '/employee/my') {
        apiUrl = api.employee.my_list
    } else if (url.hash.href === '/employee/list') {
        apiUrl = api.employee.all_list
        /**
         * 公司下拉列表
         */
        select.render("#company_select", api.company.all, "id", "name")
    }
    //渲染表格列表
    let employee_table = table.render({
        elem: '#employee-table',
        url: apiUrl,
        toolbar: '#employee-tools',
        cols: [[
            {field: 'companyName', title: '公司', align: 'center', minWidth: 100},
            {field: 'name', title: '姓名', align: 'center'},
            {field: 'phone', title: '手机', align: 'center'},
            {field: 'wechat', title: '微信', align: 'center'},
            {field: 'dept', title: '部门', align: 'center'},
            {field: 'job', title: '岗位', align: 'center'},
            {field: 'status', title: '状态', align: 'center'},
            {title: '操作', width: 200, minWidth: 160, align: 'center', fixed: 'right', templet: '#template'}
        ]]
    });
    //监听表格内操作
    table.on('tool(employee-table)', function (obj) {
        let data = obj.data;
        if (obj.event === 'info') {
            //详细信息
            details(data)
        } else if (obj.event === 'edit') {
            //编辑
            edit(data)
        } else if (obj.event === 'del') {
            //删除
            view.del(obj, $, api.company.del, data)
        }
    });
    //监听表格工具栏
    table.on('toolbar(employee-table)', function (obj) {
        switch (obj.event) {
            case 'Reload':
                employee_table.reload({where: ''})
                break;
        }

    });
    //搜索
    form.on('submit(employee-search)', function (data) {
        employee_table.reload({
            where: data.field
        })
        return false;
    })
    form.render()
    exports('employee', {})
});