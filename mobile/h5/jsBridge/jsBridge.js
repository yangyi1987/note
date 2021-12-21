
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