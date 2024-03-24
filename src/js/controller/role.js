/**
 * role模块
 * @author devcxl
 */
layui.define(['table', 'api', 'view', 'laydate', 'treeTable'], function (exports) {
    let $ = layui.$
        , api = layui.api
        , table = layui.table
        , form = layui.form
        , view = layui.view
        , treeTable = layui.treeTable
        , laydate = layui.laydate;

    //渲染表格
    let roles_table = table.render({
        elem: '#roles-table',
        url: api.role.list,
        toolbar: '#role-tools',
        cols: [[
            // {type: 'checkbox', fixed: 'left'}
            {field: 'id', minWidth: 100, width: 100, title: 'ID', sort: true},
            {field: 'name', title: '角色名', minWidth: 100, width: 120, align: 'center'},
            {field: 'description', title: '描述', minWidth: 120},
            {field: 'createTime', title: '创建时间', sort: true, minWidth: 170},
            {
                title: '操作',
                width: 200,
                minWidth: 160,
                align: 'center',
                fixed: 'right',
                templet: function (data) {
                    let html = '<a class="layui-btn layui-btn-xs" lay-event="info">详细</a>';
                    if (sessionStorage.getItem(api.role.update)) {
                        html += '<a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit">编辑</a>';
                    }
                    if (sessionStorage.getItem(api.role.del)) {
                        if (data.id <= 5) {
                            html += '<a class="layui-btn layui-btn-disabled layui-btn-xs">删除</a>';
                        } else {
                            html += '<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>';
                        }
                    }
                    return html;
                }
            }
        ]]
    });


    //监听表格内操作
    table.on('tool(roles-table)', function (obj) {
        let data = obj.data;
        //详细信息
        if (obj.event === 'info') {
            view.popup({
                title: '查看角色'
                , area: ['1300px', '618px']
                , id: 'role-get-view'
                , success: function (layero, index) {
                    layero.find('#role-get-view').load('/view/role/form.html', "", function () {
                        form.val('roles-view-from', data);
                        layero.find('#roles-form-div-submit').hide();
                        layero.find('input').attr('disabled', '')
                        pertable(data)
                    });
                }
            })
        }
        //编辑
        else if (obj.event === 'edit') {
            view.popup({
                title: '编辑角色'
                , area: ['1300px', '900px']
                , id: 'role-add-view'
                , success: function (layero, index) {
                    layero.find('#role-add-view').load('/view/role/form.html', "", function () {
                        form.val('roles-view-from', data)
                        laydate.render({
                            elem: '#createTime',
                            type: 'datetime',
                            format: 'yyyy-MM-dd HH:mm:ss'
                        });
                        let per = pertable(data)
                        //提交操作
                        form.on('submit(roles-update)', function (data) {
                            let field = data.field; //获取提交的字段

                            field.status = field.status ? field.status : 0;
                            field.ids = treeTable.checked(per) ? treeTable.checked(per) : [];
                            console.log(field)
                            $.post({
                                url: api.role.update,
                                data: field,
                                success: function (res) {
                                    view.success(res.msg);
                                },
                                complete: function () {
                                    roles_table.reload(); //重载表格
                                }
                            })
                            layer.close(index); //执行关闭
                            return false;
                        });
                    });
                }
            })
        }
        //删除
        else if (obj.event === 'del') {
            view.del(obj, $, api.role.del, data)
        }
    });

    //监听表格工具栏
    table.on('toolbar(roles-table)', function (obj) {
        switch (obj.event) {
            case 'Re':
                roles_table.reload({where: ''})
                break;
            case 'Add':
                view.popup({
                    title: '添加角色'
                    , area: ['500px', '400px']
                    , id: 'role-add-view'
                    , success: function (layero, index) {
                        layero.find('#role-add-view').load('/view/role/addForm.html', "", function () {
                            form.render()
                            //提交操作
                            form.on('submit(roles-add)', function (data) {
                                let field = data.field; //获取提交的字段
                                field.status = field.status ? field.status : 0;
                                field.ids = [];
                                $.post({
                                    url: api.role.add,
                                    data: field,
                                    success: function (res) {
                                        if (res.code == 400) {
                                            view.failed(res.msg)
                                        } else {
                                            view.success(res.msg);
                                        }
                                    },
                                    complete: function () {
                                        roles_table.reload(); //重载表格
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

    form.render()


    let pertable = function (data) {
        let per_table = treeTable.render({
            elem: '#role-per',// 必须
            url: api.permission.list,
            icon_key: 'name',// 折叠图标必须
            cols: [{
                key: 'name', title: '名称', width: '200px',
                template: function (item) {
                    if (item.type == "菜单") {
                        return '<a href="javascript:;" style="color: #8fce88">' + item.name + '</a>';
                    } else if (item.type == "菜单项") {
                        return '<a href="javascript:;" style="color: #5d5db4">' + item.name + '</a>';
                    } else {
                        return '<a href="javascript:;" style="color: #b46c6c">' + item.name + '</a>';
                    }
                }
            }, {key: 'id', title: 'ID', align: 'center', width: '50px',},
                {key: 'pid', title: '父id', align: 'center', width: '50px',},
                {
                    key: 'uri', title: '路径', align: 'center', template: function (item) {
                        return item.uri == undefined ? '' : item.uri;
                    }
                },
                {
                    key: 'type', title: '类型', width: '120px', align: 'center'
                }],
            is_click_icon: false,
            is_checkbox: true,
            is_cache: true,
            end: function (e) {

            },
            done: function (res) {
                $.post({
                    url: '/api/role/has',
                    data: data,
                    success: function (res) {
                        layui.each(res.data, function (index, item) {
                            treeTable.setChecked(per_table, item)
                        })
                    },
                    error: function (res) {
                        view.failed('获取权限信息失败')
                    }
                })
            }
        });

        return per_table;
    }
    exports('role', {})
});