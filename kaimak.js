(function () {
    if (window.__kaimak_installed === true) {
        return;
    }
    try {
        let __kaimak_kaikas = {
            isKaikas: true,
            _kaikas: new Proxy({
                isEnabled: function () {
                    return new Promise((resolve, _) => resolve(true));
                },
                isApproved: function () {
                    return new Promise((resolve, _) => resolve(true));
                },
                isUnlocked: function () {
                    return window.ethereum._metamask.isUnlocked().then((x) => {
                        return x;
                    });
                }
            }, { get: (target, name) => { return target[name] } }),
            off: window.ethereum.removeListener.bind(window.ethereum),
            enable: (function () {
                if (!__kaimak_installed) {
                    __kaimak_installed = true;
                    return async () => {
                        let addrs = await window.ethereum.enable();
                        window.klaytn.selectedAddress = addrs[0];
                        window.klaytn.emit("accountsChanged", addrs);
                        return addrs;
                    };
                }
                return window.ethereum.enable();
            }).bind(window.ethereum),
            sendAsync: function (options, callback) {
                let options_ = { ...options };
                options_.method = options_.method.replace("klay", "eth");
                if (options_.method === "eth_sendTransaction") {
                    for (let i = 0; i < (options_.params ?? []).length; i++) {
                        if (options_.params[i].type === "SMART_CONTRACT_EXECUTION") {
                            delete options_.params[i].type;
                        }
                    }
                }
                window.ethereum.sendAsync(options_, callback);
            },
            supportsSubscriptions: function () {
                return false;
            }
        };
        let __kaimak_handler = {
            get: function (target, name) {
                if (name === "networkVersion") {
                    if (typeof window.ethereum[name] === "string") {
                        return Number.parseInt(window.ethereum[name], 10);
                    }
                }
                if (name in target) {
                    return target[name];
                }
                return window.ethereum[name];
            }
        };

        window.klaytn = new Proxy(__kaimak_kaikas, __kaimak_handler);
    } finally {
        window.__kaimak_installed = true;
    }
})();