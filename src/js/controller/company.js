/**
 * company
 * @author devcxl
 */

layui.define(['table', 'jquery', 'form', 'api', 'view', 'laydate', 'select'], function (exports) {
    let $ = layui.jquery
    let api = layui.api
    let table = layui.table
    let select = layui.select
    let form = layui.form
    let view = layui.view
    let laydate = layui.laydate;
    //渲染表格列表
    let customers_table = table.render({
        elem: '#customers-table',
        url: api.company.list,
        toolbar: '#customers-tools',
        cols: [[
            {field: 'name', title: '公司', align: 'center', minWidth: 100},
            {field: 'linkman', title: '负责人', align: 'center'},
            {field: 'phone', title: '手机', align: 'center'},
            {field: 'address', title: '地址', align: 'center'},
            {field: 'state', title: '状态', width: 90, minWidth: 90, align: 'center'},
            {field: 'serviceTime', title: '服务到期', align: 'center', sort: true},
            {field: 'regTime', title: '注册时间', align: 'center', sort: true},
            {
                title: '到期状态',
                width: 80,
                minWidth: 80,
                align: 'center',
                templet: function (data) {
                    let time = new Date(data.serviceTime)
                    return time >= new Date() ? '未到期' : '已到期';
                }
            },
            {
                title: '操作',
                width: 200,
                minWidth: 160,
                align: 'center',
                fixed: 'right',
                templet: function () {
                    let html = ''
                    html += '<a class="layui-btn layui-btn-xs" lay-event="info">详细</a>'
                    if (sessionStorage.getItem(api.company.update)) {
                        html += '<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit">编辑</a>'
                    }
                    if (sessionStorage.getItem(api.company.del)) {
                        html += '<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>'
                    }
                    return html;
                }
            }
        ]]
    });
    //监听表格内操作
    table.on('tool(customers-table)', function (obj) {
        let data = obj.data;
        //详细信息
        if (obj.event === 'info') {
            // layer.msg(JSON.stringify(data))
            view.popup({
                title: '查看客户'
                , area: ['700px', '518px']
                , id: 'customer-get-view'
                , success: function (layero, index) {
                    layero.find('#customer-get-view').load('/view/company/form.html', null, function () {
                        select.render(
                            '#ecUserId',
                            api.user.all,
                            'id',
                            'name',
                            data.ecUserId
                        )
                        $.get({
                            url: api.company.info,
                            data: {"id": data.id},
                            success: function (res) {
                                $('#customers-form-div-submit').hide()
                                form.val('customers-view-from', res.data);
                                form.render()
                            }
                        })
                    })


                }
            })
        }
        //编辑
        else if (obj.event === 'edit') {
            view.popup({
                title: '编辑客户'
                , area: ['700px', '538px']
                , id: 'customer-update-view'
                , success: function (layero, index) {
                    layero.find('#customer-update-view').load('/view/company/form.html', null, function () {
                        select.render(
                            '#ecUserId',
                            api.user.all,
                            'id',
                            'name',
                            data.ecUserId
                        )
                        //填充数据
                        //渲染加入时间
                        laydate.render({
                            elem: '#spsTime',
                            type: 'datetime',
                            format: 'yyyy-MM-dd HH:mm:ss'
                        });
                        laydate.render({
                            elem: '#omsTime',
                            type: 'datetime',
                            format: 'yyyy-MM-dd HH:mm:ss'
                        });
                        laydate.render({
                            elem: '#serviceTime',
                            type: 'datetime',
                            format: 'yyyy-MM-dd HH:mm:ss'
                        });
                        $.get({
                            url: api.company.info,
                            data: {"id": data.id},
                            success: function (res) {
                                form.val('customers-view-from', res.data);
                                form.render()
                            }
                        })
                        //提交操作
                        form.on('submit(customers-update)', function (data) {
                            let field = data.field; //获取提交的字段
                            field.status = field.status ? field.status : 0;
                            field.emailStatus = field.emailStatus ? field.emailStatus : 0;
                            field.isVip = field.isVip ? field.isVip : 0;

                            $.post({
                                url: api.company.update,
                                data: field,
                                success: function (res) {
                                    view.success(res.msg);
                                },
                                complete: function () {
                                    layui.table.reload('customers-table'); //重载表格
                                }
                            })
                            layer.close(index); //执行关闭
                            return false;
                        });
                    })
                }
            })
        }
        //删除
        else if (obj.event === 'del') {
            view.del(obj, $, api.company.del, data, function () {
                customers_table.reload()
            })

        }
    });
    //监听表格工具栏
    table.on('toolbar(customers-table)', function (obj) {
        // let checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'Re':
                customers_table.reload({where: ''})
                break;
            case 'add':
                view.popup({
                    title: '添加公司'
                    , area: ['700px', '300px']
                    , id: 'company-add-view'
                    , success: function (layero, index) {
                        layero.find('#company-add-view').load('/view/company/addform.html', null, function () {
                            form.on('submit(customers-update)', function (data) {
                                let field = data.field; //获取提交的字段
                                $.post({
                                    url: api.company.add,
                                    data: field,
                                    success: function (res) {
                                        if (res.code == 200) {
                                            view.success(res.msg);
                                        } else {
                                            view.failed(res.msg)
                                        }
                                    },
                                    complete: function () {
                                        layui.table.reload('customers-table'); //重载表格
                                    }
                                })
                                layer.close(index); //执行关闭
                                return false;
                            });
                        });
                    }
                })
                break;
        }
        ;
    });
    //搜索
    form.on('submit(customers-search)', function (data) {
        customers_table.reload({
            where: data.field
        })
        return false;
    })
    form.render()

    exports('company', {})
});