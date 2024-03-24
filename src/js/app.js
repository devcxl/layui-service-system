/**
 * app模块
 * @author devcxl
 */
layui.extend({

    layarea: 'component/layarea',
    select: 'component/select',
    sms: 'component/sms',
    starts: 'component/starts',
    textImg: 'component/textImg',
    treeTable: 'component/treeTable',

    route: 'module/route',
    api: 'module/api',
    common: 'module/common',
    layout: 'module/layout',
    conf: 'module/conf',
    view: 'module/view',
    storage: 'module/storage',


    register: 'controller/register',
    repass: 'controller/repass',
    join: 'controller/join',
    customer: 'controller/customers',
    role: 'controller/role',
    permissions: 'controller/permissions',
    company: 'controller/company',
    user: 'controller/user',
    work_order: 'controller/work_order',
    work_order_add: 'controller/work_order_add',
    employee: 'controller/employee',
    product: 'controller/product',
    forget: 'controller/forget',
    login: 'controller/login',
    console: 'controller/console'
})
layui.define(['route', 'jquery', 'element', 'laytpl', 'textImg', 'table', 'layer', 'api', 'view', 'form','layedit','common','conf'], function (exports) {
    let route = layui.route
    let common = layui.common
    let element = layui.element
    let view = layui.view
    let conf = layui.conf
    let $ = layui.jquery
    let textImg = layui.textImg
    let api = layui.api
    let layer = layui.layer
    let laytpl = layui.laytpl
    let table = layui.table
    let form = layui.form
    let layedit = layui.layedit
    let app = $('.layui-layout-body');
    
    /**
     * ajax 全局设置
     */
    $.ajaxSetup({
        url: "/", // 默认URL
        async: true, // 默认异步加载
        type: "GET", // 默认使用POST方式
        error: function (jqXHR, textStatus, errorMsg) { // 出错时默认的处理函数
            let msg = '请求到"' + this.url + '"时出错:<br>' + errorMsg;
            layer.alert(msg, {title: '[' + this.type + ']请求错误[' + jqXHR.status + ']'}, function (index) {
                layer.close(index)
            });
        }
    });

    layedit.set({
        uploadImage: {
          url: '/api/upload' //接口url
          ,type: 'POST' //默认post
        }
      });


    /**
     * 注册单页面固定路由
     */
    //注册未找到对应hash值时的回调
    route.registerNotFound(() => app.load("/view/error/404.html"));
    //注册出现异常时的回调
    route.registerError(() => app.load("/view/error/500.html"));

    route.register('/login', () => app.load("/view/login.html"))
    route.register('/reg', () => app.load("/view/reg.html"))
    //登出
    route.register('/logout', function () {
        $.get({
            url: api.common.logout,
            success: function (res) {
                sessionStorage.clear();
                view.success(res.msg, function () {
                    location.hash = "/login"
                })
            }, error: function (e) {
            }
        })
    })
    route.register('/forget', () => app.load("/view/forget.html"))
    route.register('/join', () => app.load("/view/join.html"))

    route.register('/test', () => app.load("/view/test.html"))

   
    /**
     * 设置table全局属性
     */
    table.set({
        defaultToolbar: ['filter', 'print', 'exports'],
        page: true,
        height: 'full-210',
        limit: 20,
        text: {
            none: '暂无相关数据'
        },
        response: {
            statusName: 'code', //规定返回的状态码字段为code
            statusCode: 200 //规定成功的状态码200
        },
        parseData: function (res) {
            return {
                "code": res.code, //解析接口状态
                "msg": res.msg, //解析提示文本
                "data": res.data, //解析数据列表
                "count": res.count
            }
        },
        done: function (res, page, count) {
            if (res.code === 409) {
                layui.layer.closeAll()
                location.hash = '/login'
            }
        }
    })

    /**
     * 鼠标划过提示
     */
    $('body').on('mouseenter', '*[data-tip]', function () {
        let that = $(this);
        let index = layer.tips(that.data('tip'), that, {
            time: 999000
        });
        that.data('index', index);
    }).on('mouseleave', '*[data-tip]', function () {
        //划出时关闭提示
        layer.close($(this).data('index'));
    }).on('click', '*[data-href]', function () {
        //点击带有data-href属性的节点跳转
        let that = $(this);
        location.href=that.data('href')
        layer.closeAll();
    })
    /**
     * 将list转为tree
     * @param oldArr
     * @returns {*}
     */
    let listToTree = function (oldArr) {
        //过滤条件
        oldArr = oldArr.filter(ele => ele['type'] === "菜单" || ele['type'] === "菜单项");
        oldArr.forEach(element => {
            let parentId = element.pid;
            if (parentId !== 0) {
                oldArr.forEach(ele => {
                    if (ele.id === parentId) {
                        if (!ele.permissions) {
                            ele.permissions = [];
                        }
                        ele.permissions.push(element);
                    }
                });
            }
        });
        oldArr = oldArr.filter(ele => ele.pid === 0 && ele['type'] === "菜单");
        return oldArr;
    };
    /**
     * 获取用户session信息
     */
    $.get({
        url: api.common.session,
        success: function (res) {
            if (res.data === "" || res.data == null || res.code === 400) {
                location.hash = "/login"
            } else {
                for (let i in res.data['permissions']) {
                    let hash = res.data['permissions'][i];
                    sessionStorage.setItem(hash.uri, hash.uri)
                }
                let list = res.data['permissions'].filter(ele => ele['type'] === 0 || ele['type'] === 1)
                /**
                 * 循环注册路由
                 */
                for (let i in list) {
                    let hash = list[i];
                    if (hash.pid === 0 && hash.name === "控制台") {
                        route.registerHomePage(() => location.hash = hash.uri)
                    }
                    if (hash.uri !== '/') {
                        let s = "/view" + hash.uri + ".html";
                        route.register(hash.uri, function () {
                            $('.layui-body').load(s)
                        })
                    }
                }
                /**
                 * 注册修改密码路由
                 */
                route.register('/repass', function () {
                    view.popup({
                        title: '修改密码'
                        , area: ['380px', '300px']
                        , id: 'repass-view'
                        , success: function (layero, index) {
                            layero.find('#repass-view').load('/view/repass.html', null, function () {
                                form.render()
                            })
                        }, cancel: function () {
                            location.hash = '/'
                        }
                    })
                })

                res.data['permissions'] = listToTree(res.data['permissions'])
                /**
                 * 渲染界面
                 */
                laytpl($("#template-body").html()).render(res, function (html) {
                    $('.layui-layout-body').html(html);
                    $('#headImg').attr('src', textImg(res.data.user.name || res.data.user.username))
                    element.render()
                });

                route.load()

            }
        }, error: function (e) {
            route.load()
            location.hash = "/login"
        }
    })
    $("title").text(conf.name);


    exports('app', {});
})

