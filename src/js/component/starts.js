/**
 * 评价星模块
 */
layui.define(['jquery', 'rate'], function (exports) {
    let rate = layui.rate;
    let $ = layui.jquery;
    let starts = function () {}

    /**
     * 向ele节点渲染
     * @param ele
     */
    starts.render = function (ele) {
        this.elem = $(ele)
        let name = this.elem.data("name")
        let length = this.elem.data("length")
        let value = this.elem.data("value")
        let theme = this.elem.data("theme")
        let half = this.elem.data("half")
        let text = this.elem.data("text")
        let readonly = this.elem.data("readonly")

        rate.render({
            elem: this.elem,
            length: length,
            value: value,
            theme: theme,
            half: half,
            text: text,
            choose:function (value){

            },
            readonly: readonly
        })
    }

    /**
     * 给此节点设置 好评值
     * @param value
     * @returns {*}
     */
    starts.value = function (value){
        if (value){
            this.elem.data("value",value)
            this.render(this.elem)
        }else {
            return this.elem.data("value")
        }
    }

    exports('starts', starts)
})