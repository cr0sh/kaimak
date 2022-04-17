let __kaimak_enable = window.ethereum.enable;
let __kaimak_installed = false;
let __kaimak_kaikas = {
    isKaikas: true,
    _kaikas: {
        isEnabled: function () {
            return new Promise((resolve, _) => resolve(true));
        },
        isApproved: function () {
            return new Promise((resolve, _) => resolve(true));
        },
        isUnlocked: function () {
            return window.ethereum._metamask.isUnlocked();
        }
    },
    off: window.ethereum.removeListener.bind(window.ethereum),
    enable: (function () {
        if (!__kaimak_installed) {
            __kaimak_installed = true;
            return __kaimak_enable().then((addrs) => {
                window.klaytn.selectedAddress = addrs[0];
                window.klaytn.emit("accountsChanged");
                return addrs;
            });
        }
        return __kaimak_enable();
    }).bind(window.ethereum),
    sendAsync: function (options, callback) {
        let options_ = { ...options };
        options_.method = options_.method.replace("klay", "eth");
        window.ethereum.request(options_, callback);
    }
};
let __kaimak_handler = {
    get: function (target, name) {
        if (name in __kaimak_kaikas) {
            return __kaimak_kaikas[name];
        }

        return target[name];
    }
};

window.klaytn = new Proxy(window.ethereum, __kaimak_handler);
