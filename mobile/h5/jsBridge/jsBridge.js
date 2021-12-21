
window.callbacks = window.callbacks || {};

// 从 1 开始，如果小于 1 没有调函数
window.callbackCount = window.callbackCount || 1;


const JsBridge = {
    send_message: function(method, args, callback) {
        const callbackId = callback && typeof callback === 'function' ? callbackCount++ : 0;

        // 如果有 callback 将该函数添加到全局对象 callbacks 中
        if(callbackId) {
            callbacks[callbackId] = callback;
        }

        args = args || {};

        args['callbackId'] = callbackId;

        let iFrame = document.createElement('iframe');
        iFrame.src = `yy://caibeike.com&method=${method}&args=${encodeURIComponent(JSON.stringify(args))}`;
        document.body.appendChild(iFrame);
        iFrame.style.display = 'none';

        // 清除 iFrame
        setTimeout(function(){
            iFrame.parentElement.removeChild(iFrame);
        }, 500)
    },

    // native 回调
    callback: function(callbackId, returnValue) {
        try {
            let callbackFunction = callbacks[callbackId];
            if(!callbackFunction) {
                return ;
            }
            callbackFunction.apply(null, returnValue);
        }catch(err){
            console.log(err)
        }
    }
}

export default (function(){
    if(window && window.JsBridge) {
        return window.JsBridge;
    } else if (window && !window.JsBridge) {
        window.JsBridge = JsBridge;
        return JsBridge;
    } else {
        return JsBridge;
    }
})()


/**
 * 方式一: native webview 拦截 h5 URL
 * 
 * 出发点: native 提供的 webview 容器可以拦截到 h5 发出的一切 request 请求。无论是标准协议（http, https）还是私有协议 (caibeike://) 因此通过拦截与客户端指点的协议来解析 URL 解析参数并实现  H5 调用 Native
 * 实现思路: 
 *      1. 我们使用与 native 协商的 url , 在 url 中拼接相应的参数. 我们通过 url 发出 request ，native 捕获并从中获取我们传递的参数去触发指定的 Method
 *      2. 在 send_message 触发生成的 callbackId 作为  callback 的 key 将 callback 存储到 windows.callbacks  中。 callbackId 作为参数发送至 native, 而 callback 由 native 端通过 callbackId 进行调用
 *      3.native 调用 h5 中的 callback:  native 是通过执行了一个 evaluateJavaScript 函数，直接运行 js 字符串代码(类似 js 的 eval 函数) 来触发 window.callbacks 中的对应的 callbackId 的 callback 函数
 * 该方式实例如上代码所示
*/

/**
 * 方式二： native 端方法注入 webview
 * 
 * 出发点： webview 是 native 所提供的。native 开发可在初始化 webview 时通过evaluateJavaScript 函数将对应 method 挂载到 window 全局对象中， h5 只需通过调用 window 上的 method 即可触发对应的方法
 * 
 */

/**
 * 
 * h5 调 native
 *      1. 发送一个 request， webview 拦截处理
 *      2. native 将 method 注入 webview window 全局对象中直接调用 window 上的 methods
 * 
 * native 调 H5
 *      1. 通过evaluateJavaScript 执行一段 js 代码
*/
