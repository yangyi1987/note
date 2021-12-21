// vw + rem 实现手机端适配

// 计算 html fontsize 大小
function adaptation() {
    let width = window.innerWidth;
    let fontSize = +Number.parseFloat(100 / width).toFixed(6) * 100;
    document.documentElement.style.fontSize = fontSize + 'vw';
    return false;
}

adaptation();

/**
 * 
 * 思路：
 *      以 iphone 7 width = 375px 为例 100vw == 375px,则 1px = 100 / 375 vw, 1px 约等于 0.26666667vw
 *      100px 约等于 26.666667vw，这是设 html style fontSize 属性为 26.666667vw,此时 1rem === 26.666667vw 并且 1rem === 100px 而 0.2rem === 20px, 0.1rem === 0.1px
 * 
 * 1.html 的 head 中添加 mate 标签 name = viewport, content = width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no
 *  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
 * 2. 计算当前机型的 fontSize 如上代码所示
 * 
 * 
 * 该方式只适用于手机端，不适用不 pc 端及其 ipad
*/
