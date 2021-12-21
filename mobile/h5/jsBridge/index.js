// 事件监听 可不通过 h5 或 native 主动去触发
window.callbacks = {};

const JsBridge = {
    on: function(eventName, callback) {
        JSBridge.callbacks[eventName] = callback

        // open request
        const frame = document.createElement('iframe')
        frame.style.display = 'none'
        frame.src = `caibeike:listen?eventname=${eventName}`
        document.documentElement.appendChild(frame)

        // remove iframe 
        setTimeout(function(){
            document.documentElement.removeChild(frame);
        }, 500)
    },
    notifyH5: function(eventName, args) {
        let callback = window.callbacks[eventName];
        if(window.callbacks[eventName] && typeof callback === 'function') {
            callback(args);
        }
    }
}

export default (function() {
    if(window && window.JSBridge) {
        return JsBridge;
    } else if(window && !window.JSBridge) {
        window.JSBridge = JsBridge;
        return JsBridge;
    } else {
        return JsBridge;
    }
})()

/**
 * 
 * 消息订阅模式实现 h5 与 native 之前的通信
 * 1. h5 通过 on 来订阅消息
 * 2. native 在触发对应事件后使用 evaluateJavaScript 触发 JsBridge.notifyH5 事件通知触发回调
 * 
*/