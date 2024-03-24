/**
 * 控制台模块
 * @author devcxl
 */
layui.define(['jquery', 'table', 'api'], function (exports) {
    let table = layui.table
    let api = layui.api
    let $ = layui.$

    /**
     * 新增公司表格
     */
    table.render({
        elem: '#company',
        url: api.company.list,
        page: false,
        height: 'full',
        limit: 5,
        cols: [[
            {field: 'name', title: '公司', align: 'center', minWidth: 100},
            {field: 'linkman', title: '负责人', align: 'center'},
            {field: 'phone', title: '手机', align: 'center'},
            {field: 'address', title: '地址', align: 'center'},
            {field: 'state', title: '状态', width: 90, minWidth: 90, align: 'center'},
            {field: 'regTime', title: '注册时间', align: 'center'}
        ]]
        , where: {'sortField': 'true', 'status': 0}
    });

    /**
     * 新增工单表格
     */
    table.render({
        elem: '#wo',
        url: api.workOrder.all_list,
        page: false,
        height: 'full',
        limit: 5,
        cols: [[
            {field: 'orderSn', width: 200, title: '工单号', align: 'center'},
            {field: 'submitTime', title: '提交时间', align: 'center'},
            {
                field: 'committer', title: '提交者', width: 300, align: 'center', templet: function (data) {
                    return '[' + data.employee.companyName + ']-' + data.employee.name;
                }
            },
            {field: 'title', title: '工单标题', align: 'center'},

            {field: 'productName', title: '产品', align: 'center', width: 120, minWidth: 120},

        ]], where: {'sortField': 'true', 'state': 0}
    });

    /**
     * 我的新增工单
     */
    table.render({
        elem: '#my',
        url: api.workOrder.my_list,
        page: false,
        height: 'full',
        limit: 10,
        cols: [[
            {field: 'orderSn', width: 200, title: '工单号', align: 'center'},
            {field: 'submitTime', title: '提交时间', align: 'center'},
            {
                field: 'committer', title: '提交者', width: 300, align: 'center', templet: function (data) {
                    return '[' + data.employee.companyName + ']-' + data.employee.name;
                }
            },
            {field: 'title', title: '工单标题', align: 'center'},

            {field: 'productName', title: '产品', align: 'center', width: 120, minWidth: 120},

        ]], where: {'sortField': 'submit_time','state': 0}
    });
    /**
     *  后台用户排行
     */
    table.render({
        elem: '#rankUser',
        url: api.user.rank,
        page: false,
        height: 'full',
        limit: 5,
        cols: [[
            {title: '排名',type:'numbers'},
            {field: 'total', width: 200, title: '工单总量', align: 'center'},
            {field: 'username', title: '姓名', align: 'center'},
        ]]
    });


    /**
     * 对所有信息卡片进行渲染
     */
    let cards = $('.cart')
    layui.each(cards, function (index, item) {
        item = $(item)
        let url = item.data('url') || '/mock/temp.json'
        let where = item.data('where') || ''
        $.get({
            url: url,
            data: where,
            success: function (res) {
                item.find('.num').html(res.data)
            }
        })
    })
    exports('console', {});
})