/**
 * 通用工具类模块
 * @author devcxl
 */
layui.define(['api', 'form'], function (exports) {
    let api = layui.api;
    let $ = layui.jquery;
    let form = layui.form;
    let common = function () {
    }

    /**
     * 获取图片验证码
     */
    common.getImageCaptcha = function (ele) {
        $.get(api.common.imageCaptcha, function (res) {
            ele.attr("src", res.data)
        })
    }

    /**
     * 生成uuid
     * @returns {string}
     */
    common.uuid = function () {
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        let uuid = s.join("");
        return uuid;
    }

    /**
     * 表单验证
     */
    form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        },
        password: function (value, item) {
            if (/^[A-Za-z]{6,16}$/.test(value)) {
                return '不能是纯字母'
            }
            if (/^[0-9]{6,16}$/.test(value)) {
                return '不能是纯数字'
            }
        },
        lxfs: function (value, item) {
            if (!/^((0\d{2,3}?\d{7,8})|(1[3465789]\d{9}))$/.test(value)) {
                return '请输入固话号码或手机号'
            }
        },
        zhName: function (value, item) {
            if (!/^(?:[\u4e00-\u9fa5·]{2,16})$/.test(value)) {
                return '请输入真实中文姓名'
            }
        }

    });


    exports('common', common)
});

