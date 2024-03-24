/**
 * @author devcxl
 * 前端路由 分配请求视图
 */
layui.define(function (exports) {
    class HashRouter {
        constructor() {
            //用于存储不同hash值对应的回调函数
            this.routers = {};
            window.addEventListener('hashchange', this.load.bind(this), false);
            console.debug("路由初始化 .... %s", new Date().getTime())
        }

        //用于注册每个视图
        register(hash, callback = function () {
        }) {
            console.debug("路由注册:%s", hash)
            this.routers[hash] = callback;
        }

        /**
         * 处理视图未找到的情况
         * @param callback
         */
        registerNotFound(callback = function () {
        }) {
            this.routers['404'] = callback;
        }

        /**
         * 注册默认首页
         * @param callback
         */
        registerHomePage(callback = function () {
        }) {
            this.routers['index'] = callback;
        }

        /**
         * 用于处理异常情况
         * @param callback
         */
        registerError(callback = function () {
        }) {
            this.routers['error'] = callback;
        }

        /**
         * 调用不同视图的回调函数
         */
        load() {
            // let startTime = new Date().getTime();
            let hash = location.hash.slice(1), handler;
            //没有hash 默认为首页
            if (!hash||hash==="/") {
                handler = this.routers['index'] || function () {
                }
            }
            //未找到对应hash值
            else if (!this.routers.hasOwnProperty(hash)) {
                handler = this.routers['404'] || function () { };
            } else {
                handler = this.routers[hash]
            }
            //执行注册的回调函数
            try {
                handler.apply(this);
            } catch (e) {
                console.error(e);
                (this.routers['error'] || function () { }).call(this, e);
            }
            // console.debug('[加载: %s - spend: %s ]', hash,new Date().getTime()-startTime)
        }
    }

    exports('route', new HashRouter());
});