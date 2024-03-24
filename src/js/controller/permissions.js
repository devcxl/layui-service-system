/**
 * permission模块
 * @author devcxl
 */
layui.define(['jquery', 'form', 'api', 'treeTable', 'view'], function (exports) {
    let form = layui.form;
    let $ = layui.jquery;
    let treeTable = layui.treeTable;
    let api = layui.api;
    let view = layui.view;
    //渲染
    let table = treeTable.render({
        elem: '#tree-table',
        url: api.permission.list,
        icon_key: 'name',
        cols: [{
            key: 'name', title: '名称', width: '200px', minWidth: '200px',
            template: function (item) {
                if (item.type === "菜单") {
                    return '<a href="javascript:;" style="color: #8fce88">' + item.name + '</a>';
                } else if (item.type === "菜单项") {
                    return '<a href="javascript:;" style="color: #5d5db4">' + item.name + '</a>';
                } else {
                    return '<a href="javascript:;" style="color: #b46c6c">' + item.name + '</a>';

                }
            }
        }, {key: 'id', title: 'ID', align: 'center', width: '50px',},
            {key: 'pid', title: '父id', align: 'center', width: '50px',},
            {
                key: 'uri', title: '路径', align: 'center', template: function (item) {
                    return item.uri === undefined ? '' : item.uri;
                }
            },
            {
                key: 'type', title: '类型', width: '120px', align: 'center'
            },
            {
                key: 'value', title: '值', align: 'center', template: function (item) {
                    return item.value === undefined ? '' : item.value;
                }
            },
            {
                key: 'sort', title: '排序', align: 'center', template: function (item) {
                    return item.sort === undefined ? '' : item.sort;
                }
            },
            {
                title: '操作', align: 'center', width: '200px', template: function (item) {
                    let html = ''
                    if (sessionStorage.getItem(api.permission.add) && item.type !== "接口") {
                        html += '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-filter="addChild">+子权限</a>'
                    }
                    if (sessionStorage.getItem(api.permission.update)) {
                        html += '<a class="layui-btn layui-btn-normal layui-btn-xs" lay-filter="edit">编辑</a>'
                    }
                    if (sessionStorage.getItem(api.permission.del)) {
                        html += '<a class="layui-btn layui-btn-danger layui-btn-xs" lay-filter="del">删除</a>';
                    }
                    return html;
                }
            }],
        is_click_icon: false,
        is_checkbox: false,
        is_cache: true,
        end: function (e) {
            //
        },
        done: function (res) {
            if (res.code === 403) {
                location.hash = "/login"
            }
        }
    })

    form.verify({
        pid: function (value) {
            if (value === $('#id').val()) {
                return '父id不能与id一致'
            }
        }
    });

    let edit = function (index, api) {
        form.on('submit(permission-submit)', function (data) {
            //获取提交的字段
            let field = data.field;
            $.post({
                url: api,
                data: field,
                success: function (res) {
                    if (res.code === 200) {
                        view.success(res.msg);
                    } else {
                        view.failed(res.msg)
                    }
                },
                complete: function () {
                    treeTable.render(table) //重载表格
                }
            })
            layer.close(index); //执行关闭
            return false;
        });
    }
    /**
     * 编辑节点
     */
    treeTable.on('tree(edit)', function (obj) {
        view.popup({
            title: '编辑权限'
            , area: ['700px', '400px']
            , id: 'permission-edit-view'
            , success: function (layero, index) {
                layero.find('#permission-edit-view').load('/view/permission/form.html', null, function () {
                    //获取权限信息
                    $.get({
                        url: api.permission.info,
                        data: {"id": obj.item.id},
                        success: function (res) {
                            console.log(res)
                            form.val('permission-view-from', res.data)
                            form.render()
                        }
                    })
                    let id = layero.find("input[name='id']")
                    id.attr('disabled', '')
                    edit(index, api.permission.update)
                    form.render()
                })
            }
        })
    });
    /**
     * 添加子权限节点
     */
    treeTable.on('tree(addChild)', function (obj) {
        view.popup({
            title: '添加子权限'
            , area: ['700px', '400px']
            , id: 'permission-add-view'
            , success: function (layero, index) {
                layero.find('#permission-add-view').load('/view/permission/form.html', null, function () {

                    let pid = layero.find("input[name='pid']")
                    pid.val(obj.item.id)
                    pid.attr('disabled', '')
                    let id = layero.find("input[name='id']")
                    id.val("")
                    edit(index, api.permission.add)
                    form.render()
                })
            }
        })
    });
    /**
     * 删除权限节点
     */
    treeTable.on('tree(del)', function (obj) {
        let data = obj.item;
        view.del(obj, $, api.permission.del, data, true, function () {
            treeTable.render(table)
        })
    });
    /**
     * 添加父权限
     */
    $('#permission-add-p').on('click', function () {
        view.popup({
            title: '添加权限'
            , area: ['700px', '400px']
            , id: 'permission-add-view'
            , success: function (layero, index) {
                layero.find('#permission-add-view').load('/view/permission/form.html', null, function () {
                    let pid = layero.find("input[name='pid']")
                    pid.val(0)
                    pid.attr('disabled', '')
                    let id = layero.find("input[name='id']")
                    id.attr('disabled', '')
                    form.render('select')
                    edit(index, api.permission.add)
                    form.render()
                })
            }
        })
    })
    /**
     * 展开全部
     */
    $('#permission-open-all').on('click', function () {
        treeTable.openAll(table)
    });
    /**
     * 关闭全部
     */
    $('#permission-close-all').on('click', function () {
        treeTable.closeAll(table)
    });

    exports('permissions', {});
});