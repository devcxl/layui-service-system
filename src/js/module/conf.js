/**
 * 项目的配置
 */
layui.define(function (exports) {
    exports('conf', {
        name: '网站标题',              //网站标题
        tableName: 'ism',           //本地存储表名
        views: '/view',             //视图所在目录
        styles: '/style',           //视图所在目录
        entry: 'index',             //默认视图文件名
        engine: '.html',            //视图文件后缀名
        interceptor: false,          //是否拦截未登陆
        tokenName: 'access-token',  //请求头中token的名称
        codeName: 'code',           //返回码名称
        msgName: 'msg',             //返回消息名称
        dataName: 'data',           //返回数据名称
    })
});

