/**
 * product
 * @author devcxl
 */

layui.define(['jquery', 'form', 'api', 'treeTable', 'storage', 'view'], function (exports) {
    let form = layui.form;
    let $ = layui.jquery;
    let treeTable = layui.treeTable;
    let api = layui.api;
    let view = layui.view;


    //渲染
    let table = treeTable.render({
        elem: '#tree-table',// 必须
        url: api.product.list,
        icon_key: 'name',// 折叠图标必须
        cols: [{
            key: 'name', title: '名称', width: '800px', minWidth: '200px',
            template: function (item) {
                let name = item.name;
                if (name.lastIndexOf("-")!=-1){
                    return '<a href="javascript:;">' + name.substring(name.lastIndexOf("-"))+ '</a>';
                }else {
                    return '<a href="javascript:;">' + name + '</a>';
                }

            }
        }, {key: 'id', title: 'ID', align: 'center'},
            {key: 'pid', title: '父id', align: 'center'},
            {
                key: 'sort', title: '排序', align: 'center', template: function (item) {
                    return item.sort == undefined ? '' : item.sort;
                }
            },
            {
                title: '操作', align: 'center', width: '200px', template: function (item) {
                    let html = ''
                    if (sessionStorage.getItem(api.product.add) && item.type != "接口") {
                        html += '<a class="layui-btn layui-btn-primary layui-btn-xs" lay-filter="addChild">+子模块</a>'
                    }
                    if (sessionStorage.getItem(api.product.del)) {
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
            if (res.code == 403) {
                location.hash = "/login"
            }
        }
    })
    //监听表格内编辑操作
    treeTable.on('tree(edit)', function (obj) {
        view.popup({
            title: '编辑权限'
            , area: ['700px', '400px']
            , id: 'product-add-view'
            , success: function (layero, index) {
                layero.find('#product-add-view').load('/view/product/form.html', null, function () {
                    let id = layero.find("input[name='id']")
                    id.attr('disabled', '')
                    //表单的校验
                    form.verify({
                        pid: function (value, item) {
                            if (value == $('#id').val()) {
                                return '父id不能与id一致'
                            }
                        }
                    });
                    form.on('submit(product-submit)', function (data) {
                        let field = data.field; //获取提交的字段
                        $.post({
                            url: api.product.update,
                            data: field,
                            success: function (res) {
                                view.success(res.msg);
                            }, error: function (res) {
                                view.failed(res.msg)
                            },
                            complete: function () {
                                treeTable.render(table) //重载表格
                            }
                        })
                        layer.close(index); //执行关闭
                        return false;
                    });
                    form.render()
                })
            }
        })
    });
    //添加子权限节点
    treeTable.on('tree(addChild)', function (obj) {
        view.popup({
            title: '添加子模块'
            , area: ['700px', '400px']
            , id: 'product-add-view'
            , success: function (layero, index) {
                layero.find('#product-add-view').load('/view/product/form.html', null, function () {

                    let pid = layero.find("input[name='pid']")
                    pid.val(obj.item.id)
                    pid.attr('disabled', '')
                    let id = layero.find("input[name='id']")
                    id.val("")
                    //表单的校验
                    form.verify({
                        pid: function (value, item) {
                            if (value == $('#id').val()) {
                                return '父id不能与id一致'
                            }
                        }
                    });
                    form.on('submit(product-submit)', function (data) {
                        let field = data.field; //获取提交的字段
                        $.post({
                            url: api.product.add,
                            data: field,
                            success: function (res) {
                                view.success(res.msg);
                            }, error: function (res) {
                                view.failed(res.msg)
                            },
                            complete: function () {
                                treeTable.render(table) //重载表格
                            }
                        })
                        layer.close(index); //执行关闭
                        return false;
                    });
                    form.render()
                })
            }
        })
    });

    //删除事件
    treeTable.on('tree(del)', function (obj) {
        let data = obj.item;
        view.del(obj, $, api.product.del, data, true, function () {
            treeTable.render(table)
        })
        // location.hash='/product/list'
    });

    //添加父权限
    $('#product-add-p').on('click', function () {
        view.popup({
            title: '添加父模块'
            , area: ['700px', '400px']
            , id: 'product-add-view'
            , success: function (layero, index) {
                layero.find('#product-add-view').load('/view/product/form.html', null, function () {
                    let pid = layero.find("input[name='pid']")
                    pid.val(0)
                    pid.attr('disabled', '')
                    let id = layero.find("input[name='id']")
                    id.attr('disabled', '')
                    //表单的校验
                    form.verify({
                        pid: function (value, item) {
                            if (value == $('#id').val()) {
                                return '父id不能与id一致'
                            }
                        }
                    });
                    form.on('submit(product-submit)', function (data) {
                        let field = data.field; //获取提交的字段
                        $.post({
                            url: api.product.add,
                            data: field,
                            success: function (res) {
                                view.success(res.msg);
                            }, error: function (res) {
                                view.failed(res.msg)
                            },
                            complete: function () {
                                treeTable.render(table) //重载表格
                            }
                        })
                        layer.close(index); //执行关闭
                        return false;
                    });
                    form.render()
                })
            }
        })
    })

    $('#product-open-all').on('click', function () {
        treeTable.openAll(table)
    });

    $('#product-close-all').on('click', function () {
        treeTable.closeAll(table)
    });

    exports('product', {});
});