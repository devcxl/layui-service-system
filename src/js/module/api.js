/**
 * api模块 统一管理所有接口
 * @author devcxl
 */
layui.define(function (exports) {
    exports('api', {
        user: {
            login: '/api/user/login',
            list: '/api/user/list',
            add: '/api/user/add',
            del: '/api/user/del',
            all: '/api/user/all',
            info: '/api/user/info',
            role: '/api/user/role',
            rank: '/api/user/rank-user',
            update: '/api/user/update'
        },
        employee: {
            login: '/api/employee/login',
            reg: '/api/employee/reg',
            my_list: '/api/employee/my-list',
            all_list: '/api/employee/all-list',
            all: '/api/employee/all',
            update: '/api/employee/update',
            company: '/api/employee/company',
            info: '/api/employee/info',
            phone: '/api/employee/phone',
            name: '/api/employee/name',
            forget: '/api/employee/forget',
            repass: '/api/employee/reset',
            del: '/api/employee/del'
        },
        company: {
            list: '/api/company/list',
            info: '/api/company/info',
            all: '/api/company/all',
            update: '/api/company/update',
            phone: '/api/company/phone',
            name: '/api/company/name',
            reg: '/api/company/join',
            add: '/api/company/add',
            del: '/api/company/del'
        },
        role: {
            list: '/api/role/list',
            update: '/api/role/update',
            del: '/api/role/del',
            all: '/api/role/all',
            add: '/api/role/add'
        },
        workOrder: {
            all_list: '/api/workOrder/all-list',
            my_list: '/api/workOrder/my-list',
            company_list: '/api/workOrder/company-list',
            update: '/api/workOrder/update',
            del: '/api/workOrder/del',
            dist: '/api/workOrder/dist',
            done: '/api/workOrder/done',
            handlerDone: '/api/workOrder/handlerDone',
            handler: '/api/workOrder/handler',
            append: '/api/workOrder/append',
            upload: '/api/workOrder/upload',
            appraise: '/api/workOrder/appraise',
            info: '/api/workOrder/info',
            addMan: '/api/workOrder/addMan',
            add: '/api/workOrder/add'
        },
        permission: {
            list: '/api/permission/list',
            add: '/api/permission/add',
            info: '/api/permission/info',
            update: '/api/permission/update',
            del: '/api/permission/del',
        },
        common: {
            session: '/mock/session.json',
            logout: '/api/logout',
            imageCaptcha: '/api/imageCaptcha',
            smsCode: '/api/sms',
            repass: '/api/repass'
        },
        product: {
            add: '/api/product/add',
            list: '/api/product/list',
            del: '/api/product/del'
        }

    });

});