/**
 * 存储模块
 */
layui.define(['conf'], function (exports) {

    let conf = layui.conf;
    let storage = {}

    /**
     * 设置客户端唯一id
     * @param data
     */
    storage.setClientUID = function (data) {
        storage.set("clientUID", data)
    }

    /**
     * 获取客户端唯一id
     * @returns {*}
     */
    storage.getClientUID = function () {
        return storage.get("clientUID")
    }

    /**
     * 获取接口访问令牌
     * @returns {*}
     */
    storage.getToken = function () {
        return storage.get(conf.tokenName)
    }
    /**
     * 保存内容到表
     * @param k
     * @param v
     */
    storage.set = function (k, v) {
        layui.data(conf.tableName, {key: k, value: v})
    }

    /**
     * 获取内容到表
     * @param key
     * @returns {*}
     */
    storage.get = function (key) {
        return layui.data(conf.tableName)[key];
    }

    exports('storage', storage)
});