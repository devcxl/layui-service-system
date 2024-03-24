/**
 * 文字转头像
 */
layui.define(function (exports) {
    /**
     * 文字转头像
     * @param name
     * @returns {string}
     */
    let textToImage = function (name) {
        //设置初始值,防止name为空时程序无法执行
        let nick = "未知";
        //判断name是否为空
        if (name) {
            nick = name.charAt(0);
        }
        let fontSize = 14;
        let fontWeight = 'normal';

        let canvas = document.getElementById('canvas');
        if (canvas) {
            canvas.remove();
        } else {
            let div = document.createElement('canvas');
            div.setAttribute("id", "canvas")
            div.setAttribute("style", "display:none")
            document.getElementsByTagName('body')[0].appendChild(div)
            canvas = document.getElementById('canvas');
        }
        canvas.width = 28;
        canvas.height = 28;
        let context = canvas.getContext('2d');
        //头像背景颜色设置
        context.fillStyle = '#2D89EF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        //头像字体颜色设置
        context.fillStyle = '#FFFFFF';
        context.font = fontWeight + ' ' + fontSize + 'px sans-serif';
        context.textAlign = 'center';
        context.textBaseline = "middle";
        context.fillText(nick, fontSize, fontSize);
        return canvas.toDataURL("image/png");
    }
    exports('textImg', textToImage);

});