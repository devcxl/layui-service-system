/**
 * work_order.js
 * @author devcxl
 */

layui.define(['jquery', 'table', 'api', 'view', 'form', 'select', 'layedit'], function (exports) {
    let api = layui.api
    let table = layui.table
    let form = layui.form
    let view = layui.view
    let select = layui.select
    let $ = layui.jquery
    let edit = layui.layedit
    let url = layui.url()
    let apiUrl = ''

    let renderSelect = function () {
        select.render("#cId", api.company.all, "id", "name", '', '选择公司')
        select.render("#managerId", api.user.all, "id", "name", '', '选择经理人')
        select.render("#handleId", api.user.all, "id", "name", '', '选择处理人')
    }

    if (url.hash.href === '/workOrder/my') {
        apiUrl = api.workOrder.my_list
    } else if (url.hash.href === '/workOrder/list') {
        apiUrl = api.workOrder.all_list
        renderSelect()
    } else if (url.hash.href === '/workOrder/company') {
        apiUrl = api.workOrder.company_list
        renderSelect()
    }
    /**
     * 查看工单
     * @param data
     */
    let detail = function (data) {
        view.popup({
            title: '查看工单'
            , area: ['1000px', '800px']
            , id: 'workOrder-detail-view'
            , success: function (layero) {
                layero.find('#workOrder-detail-view').load('/view/workOrder/form.html', "", function () {

                    $.get({
                        url: api.workOrder.info,
                        data: {"id": data.id},
                        success: function (res) {
                            form.val('workOrder-view-from', res.data);
                            $('#content').html(res.data.content)
                            $('#solution').html(res.data.solution)
                            $('#companyName').val(res.data.employee.companyName);
                            $('#product').val(res.data.productName);
                            $('#employeeName').val(res.data.employee.name);
                            $('#employeePhone').val(res.data.employee.phone);
                            $('#employeeDept').val(res.data.employee.dept);
                            $('#managerName').val(res.data.manager.username);
                            $('#managePhone').val(res.data.manager.phone);
                            $('#handlerPhone').val(res.data.handler ? res.data.handler.phone : "");
                            $('#handlerName').val(res.data.handler.username);

                        }, complete: function () {

                        }
                    })
                    form.render('select')
                    layero.find('#workOrder-form-div-submit').hide();
                    layero.find('input').attr('disabled', '')
                    layero.find('textarea').attr('disabled', '')
                    layero.find('select').attr('disabled', '')
                });
            }
        })
    }
    /**
     * 分配工单
     * @param data
     */
    let dist = function (data) {
        view.popup({
            title: '分配到'
            , area: ['380px', '500px']
            , id: 'wo-select-view'
            , success: function (layero, index) {
                layero.find('#wo-select-view').load('/view/workOrder/dist.html', "", function () {
                    select.render(
                        "#handler",
                        api.user.all,
                        "id",
                        "name", '',
                        '选择处理人'
                    )
                    //提交操作
                    form.on('submit(wk_select)', function (res) {
                        let field = res.field; //获取提交的字段
                        field.id = data.id
                        $.post({
                            url: api.workOrder.dist,
                            data: field,
                            success: function (res) {
                                if (res.code === 200) {
                                    view.success(res.msg);
                                } else {
                                    view.failed(res.msg)
                                }
                            },
                            complete: function () {
                                layui.table.reload('workOrder-table'); //重载表格
                            }
                        })
                        layer.close(index); //执行关闭
                        return false;
                    });
                    form.render()
                });
            }
        })
    }
    /**
     * 处理工单
     * @param data
     */
    let handle = function (data) {
        view.popup({
            title: '处理工单'
            , area: ['1000px', '800px']
            , id: 'workOrder-edit-view'
            , success: function (layero, index) {
                layero.find('#workOrder-edit-view').load('/view/workOrder/handler.html', "", function () {

                    $("#content").html(data.content)
                    let solution = edit.build('solution')
                    edit.setContent(solution, data.solution, false)
                    form.val('workOrder-view-from', data);
                    //提交操作
                    form.on('submit(workOrder-update)', function (data) {
                        data.field.solution = edit.getContent(solution)
                        $.post({
                            url: api.workOrder.handler,
                            data: data.field,
                            success: function (res) {
                                if (res.code === 200) {
                                    view.success(res.msg);
                                } else {
                                    view.failed(res.msg)
                                }

                            },
                            complete: function () {
                                layui.table.reload('workOrder-table'); //重载表格
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
     * 工单问题补充
     * @param data
     */
    let append = function (data) {
        view.popup({
            title: '工单问题补充'
            , area: ['1000px', '800px']
            , id: 'workOrder-edit-view'
            , success: function (layero, index) {
                layero.find('#workOrder-edit-view').load('/view/workOrder/append.html', "", function () {
                    let content = edit.build('content')
                    edit.setContent(content, data.content, false)
                    form.val('workOrder-view-from', data);
                    //提交操作
                    form.on('submit(workOrder-update)', function (data) {
                        data.field.content = edit.getContent(content)
                        $.post({
                            url: api.workOrder.append,
                            data: data.field,
                            success: function (res) {
                                if (res.code === 200) {
                                    view.success(res.msg);
                                } else {
                                    view.failed(res.msg)
                                }

                            },
                            complete: function () {
                                layui.table.reload('workOrder-table'); //重载表格
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
     * 完成工单
     * @param data
     */
    let done = function (data) {
        $.post({
            url: api.workOrder.done,
            data: data,
            success: function (res) {
                if (res.code === 200) {
                    view.success(res.msg);
                } else {
                    view.failed(res.msg)
                }
            },
            complete: function () {
                layui.table.reload('workOrder-table'); //重载表格
            }
        })
    }
    /**
     * 处理完成
     * @param data
     */
    let handlerDone = function (data) {
        if (data.solution == null || data.solution.length <= 5) {
            view.failed("工单解决方案不完善,请完善解决方案!")
        } else {
            $.post({
                url: api.workOrder.handlerDone,
                data: data,
                success: function (res) {
                    if (res.code === 200) {
                        view.success(res.msg);
                    } else {
                        view.failed(res.msg)
                    }
                },
                complete: function () {
                    layui.table.reload('workOrder-table'); //重载表格
                }
            })
        }


    }
    /**
     * 评价工单
     * @param data
     */
    let appraise = function (data) {
        view.popup({
            title: '请对本次工单进行评价'
            , area: ['350px', '400px']
            , id: 'workOrder-appraise-view'
            , success: function (layero, index) {
                layero.find('#workOrder-appraise-view').load('/view/workOrder/appraise.html', "", function () {
                    form.render('select')
                    //提交操作
                    form.on('submit(workOrder-appraise)', function (res) {
                        res.field.id = data.id
                        $.post({
                            url: api.workOrder.appraise,
                            data: res.field,
                            success: function (res) {
                                if (res.code === 200) {
                                    view.success(res.msg);
                                } else {
                                    view.error("提交失败", res.msg)
                                }

                            },
                            complete: function () {
                                layui.table.reload('workOrder-table'); //重载表格
                            }
                        })
                        layer.close(index); //执行关闭
                        return false;
                    });
                });
            }
        })
    }
    //渲染表格
    let workOrder_table = table.render({
        elem: '#workOrder-table',
        url: apiUrl,
        toolbar: '#workOrder-tools',
        cols: [[
            {field: 'id', type: 'checkbox'},
            {field: 'orderSn', width: 100, minWidth: 60, title: '工单号', align: 'center', sort: true},
            {field: 'submitTime', width: 120, minWidth: 60, title: '提交时间', align: 'center', sort: true},
            {field: 'title', title: '工单标题', width: 200, minWidth: 60, align: 'center'},
            {
                field: 'committer', title: '提交者', width: 300, align: 'center', templet: function (data) {
                    return '[' + data.employee.companyName + ']-' + data.employee.name;
                }
            },
            {field: 'productName', title: '产品', align: 'center', width: 80, minWidth: 60},
            {
                field: 'manager', title: '经理人', align: 'center', width: 80, minWidth: 60, templet: function (data) {
                    return data['manager'] && data['manager']['username'] || ''
                }
            },
            {
                field: 'handler', title: '受理人', align: 'center', width: 80, minWidth: 60, templet: function (data) {
                    return data['handler'] && data['handler']['username'] || ''
                }
            },
            {field: 'handlerType', title: '处理方式', align: 'center', width: 60, minWidth: 60},
            {field: 'state', title: '当前进度', width: 90, minWidth: 60, align: 'center'},
            {
                field: 'state', title: '工时', width: 60, minWidth: 60, align: 'center', templet: function (data) {
                    let submitTime = new Date(data.submitTime).getTime()
                    let doneTime = new Date(data.doneTime).getTime()
                    let time = doneTime - submitTime;
                    if (!doneTime) {
                        return "未知"
                    }
                    if (time > 0) {
                        if (time < 86400000) {
                            //小于一天
                            if (time < 14400000) {
                                return "半天"
                            } else {
                                return "一天"
                            }
                        } else if (time >= 86400000 && time < 86400000 * 5) {
                            //大于一天小于5天
                            let number = Math.floor(time / 86400000);
                            if ((time % 86400000) < 14400000) {
                                return number + ".5天";
                            } else {
                                let number = Math.ceil(time / 86400000);
                                return number + "天";
                            }
                        } else {
                            let number = Math.ceil(time / 86400000);
                            return number + "天"
                        }
                    } else {
                        return "error"
                    }
                }
            },
            {title: '操作', align: 'center', minWidth: 300, fixed: 'right', templet: '#template'}
        ]],
        height: 'full-210'
    });

    //监听表格内操作
    table.on('tool(workOrder-table)', function (obj) {
        let data = obj.data;

        if (obj.event === 'info') {
            //详细信息
            detail(data)
        } else if (obj.event === 'dist') {
            //分配
            dist(data)
        } else if (obj.event === 'append') {
            //append
            append(data)
        } else if (obj.event === 'handle') {
            //处理
            handle(data)
        } else if (obj.event === 'done') {
            //完成
            done(data)
        } else if (obj.event === 'handlerDone') {
            //处理完成
            handlerDone(data)
        } else if (obj.event === 'appraise') {
            //评价
            appraise(data)
        } else if (obj.event === 'upload') {
            //上传
            if (data.state === "完成") {
                let ids = []
                ids.push(data.id)
                $.post({
                    url: api.workOrder.upload,
                    data: {"ids": ids},
                    success: function (res) {
                        if (res.code == 200) {
                            view.success(res.msg, function () {
                                layui.table.reload('workOrder-table'); //重载表格
                            })
                        } else {
                            view.error("上传失败", res.msg)
                        }
                    }
                })
            } else {
                view.failed("失败: 未处理完成无法上传")
            }
        } else if (obj.event === 'del') {
            //删除
            view.del(obj, $, api.workOrder.del, data)
        }
    });

    //监听表格工具栏
    table.on('toolbar(workOrder-table)', function (obj) {
        // let checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'Reload':
                workOrder_table.reload({where: ''})
                break;
            case 'Upload':
                let data = table.checkStatus("workOrder-table")
                let ids = [];
                let flag = false;
                layui.each(data.data, function (index, item) {
                    if (item.state === "完成") {
                        ids.push(item.id)
                    } else {
                        flag = true;
                    }
                })

                if (flag) {
                    view.failed("失败: 未处理完成无法上传")
                } else {
                    $.post({
                        url: api.workOrder.upload,
                        data: {"ids": ids},
                        success: function (res) {
                            if (res.code === 200) {
                                view.success(res.msg)
                            } else {
                                view.failed(res.msg)
                            }

                        }
                    })
                }
                break;
        }

    });
    //搜索
    form.on('submit(workOrder-search)', function (data) {
        workOrder_table.reload({
            where: data.field
        })
        return false;
    })
    form.render()

    exports('work_order', {})
});