/**
 * user
 * @author devcxl
 */
layui.define(['table', 'api', 'view', 'laydate', 'select'], function (exports) {
    let $ = layui.$
        , api = layui.api
        , table = layui.table
        , form = layui.form
        , view = layui.view
        , select = layui.select
        , laydate = layui.laydate;

    /**
     * 展示详细信息
     * @param data
     */
    let info = function (data) {
        view.popup({
            title: '查看用户'
            , area: ['700px', '400px']
            , id: 'user-get-view'
            , success: function (layero, index) {
                layero.find('#user-get-view').load('/view/user/form.html', null, function () {
                    $.get({
                        url: api.user.info,
                        data: {"id": data.id},
                        success: function (res) {
                            layero.find('#users-form-div-submit').hide();
                            layero.find('input').attr('disabled', '')
                            layero.find('select').attr('disabled', '')
                            form.val('users-view-from', res.data);
                            form.render()
                        }
                    })

                })
            }
        })
    }

    /**
     * 修改操作
     * @param data
     */
    let edit = function (data) {
        view.popup({
            title: '编辑用户'
            , area: ['700px', '500px']
            , id: 'user-add-view'
            , success: function (layero, index) {
                layero.find('#user-add-view').load('/view/user/form.html', null, function () {
                    $.get({
                        url: api.user.info,
                        data: {"id": data.id},
                        success: function (res) {
                            laydate.render({
                                elem: '#entryTime',
                                type: 'datetime',
                                format: 'yyyy-MM-dd HH:mm:ss'
                            });
                            layero.find("#entryTime").attr("disabled", "")
                            if (data.id == 1) {
                                layero.find('#users-form-div-submit').hide();
                                layero.find('input').attr('disabled', '')
                            }
                            form.val('users-view-from', res.data);
                            form.render()
                        }
                    })
                    //提交操作
                    form.on('submit(users-update)', function (data) {
                        let field = data.field; //获取提交的字段
                        $.post({
                            url: api.user.update,
                            data: field,
                            success: function (res) {
                                if (res.code === 200) {
                                    view.success(res.msg);
                                } else {
                                    view.failed(res.msg)
                                }
                            }, error: function (res) {
                                console.error(res)
                            },
                            complete: function () {
                                layui.table.reload('users-table'); //重载表格
                            }
                        })
                        layer.close(index); //执行关闭
                        return false;
                    });
                });
            }
        })
    }

    /**
     * 添加操作
     */
    let add = function () {
        view.popup({
            title: '添加用户'
            , area: ['700px', '500px']
            , id: 'user-add-view'
            , success: function (layero, index) {
                layero.find('#user-add-view').load('/view/user/form.html', null, function () {
                    laydate.render({
                        elem: '#entryTime',
                        type: 'datetime',
                        format: 'yyyy-MM-dd HH:mm:ss'
                    });
                    form.render()
                    form.on('submit(users-update)', function (data) {
                        let field = data.field; //获取提交的字段
                        field.status = field.status ? field.status : 0;
                        field.emailStatus = field.emailStatus ? field.emailStatus : 0;
                        $.post({
                            url: api.user.add,
                            data: field,
                            success: function (res) {
                                if (res.code == 200) {
                                    view.success(res.msg);
                                } else {
                                    view.failed(res.msg)
                                }
                            }, error: function (res) {
                                console.error(res)
                            },
                            complete: function () {
                                layui.table.reload('users-table'); //重载表格
                            }
                        })
                        layer.close(index); //执行关闭
                        return false;
                    });
                });
            }
        })
    }

    /**
     * 选择角色操作
     * @param data
     */
    let editRole = function (data) {
        view.popup({
            title: '选择角色'
            , area: ['380px', '500px']
            , id: 'user-select-view'
            , success: function (layero, index) {
                layero.find('#user-select-view').load('/view/user/select.html', null, function () {
                    select.render(
                        '#roleId',
                        api.role.all,
                        'id',
                        'name',
                        data.roleId
                    )
                    $.get({
                        url: api.user.info,
                        data: {"id": data.id},
                        success: function (res) {
                            form.val('users-select-form', data)
                            form.render()
                        }
                    })
                    //提交操作
                    form.on('submit(users-select)', function (data) {
                        let field = data.field; //获取提交的字段
                        $.post({
                            url: api.user.role,
                            data: field,
                            success: function (res) {
                                if (res.code == 200) {
                                    view.success(res.msg);
                                } else {
                                    view.failed(res.msg)
                                }
                            }, error: function (e) {
                                view.failed(e)
                            },
                            complete: function () {
                                layui.table.reload('users-table'); //重载表格
                            }
                        })
                        layer.close(index); //执行关闭
                        return false;
                    });

                })

            }
        })
    }

    /**
     * 人员列表
     */
    let admins_table = table.render({
        elem: '#users-table',
        url: api.user.list,
        toolbar: '#user-tools',
        cols: [[
            // {type: 'checkbox', fixed: 'left'}
            {field: 'id', minWidth: 100, width: 100, title: 'ID', align: 'center', sort: true},
            {field: 'username', title: '姓名', minWidth: 100, width: 120, align: 'center'},
            {
                field: 'gender', title: '性别', width: 60, minWidth: 60, align: 'center'
            },
            {field: 'phone', title: '手机', align: 'center', minWidth: 120},
            {
                field: 'roleName', title: '角色', align: 'center', minWidth: 120
            },
            {field: 'workPhone', title: '工作手机', align: 'center', minWidth: 120},
            {field: 'entryTime', title: '加入时间', align: 'center', sort: true, minWidth: 170},
            {
                field: 'state',

                title: '状态',
                width: 80,
                minWidth: 80,
                align: 'center'
            },
            {
                title: '操作',
                width: 200,
                minWidth: 160,
                align: 'center',
                fixed: 'right',
                templet: function (data) {
                    let html = '<a class="layui-btn layui-btn-xs" lay-event="info">详细</a>';
                    if (sessionStorage.getItem(api.user.update)) {
                        if (data.id===1){
                            html += '<a class="layui-btn layui-btn-disabled layui-btn-xs" >编辑</a>';
                        }else {
                            html += '<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit">编辑</a>';
                        }
                    }
                    if (sessionStorage.getItem(api.user.role)) {
                        if (data.id === 1) {
                            html += '<a class="layui-btn layui-btn-disabled layui-btn-xs" >角色</a>';
                        } else {
                            html += '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="updateRole">角色</a>';
                        }
                    }
                    if (sessionStorage.getItem(api.user.del)) {
                        if (data.id === 1) {
                            html += '<a class="layui-btn layui-btn-disabled layui-btn-xs">删除</a>';
                        } else {
                            html += '<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>';
                        }
                    }
                    return html;
                }
            }
        ]],
        height: 'full-210',
    });

    //监听表格内操作
    table.on('tool(users-table)', function (obj) {
        let data = obj.data;
        if (obj.event === 'info') {
            info(data)
        } else if (obj.event === 'edit') {
            edit(data)
        } else if (obj.event === 'updateRole') {
            editRole(data)
        } else if (obj.event === 'del') {
            view.del(obj, $, api.user.del, data)
        }
    });

    //监听表格工具栏
    table.on('toolbar(users-table)', function (obj) {
        // let checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'Re':
                admins_table.reload({where: ''})
                break;
            case 'add':
                add()
                break;
        }
        ;
    });

    //搜索
    form.on('submit(users-search)', function (data) {
        admins_table.reload({
            where: data.field
        })
        return false;
    })
    form.render()

    exports('user',{})
});