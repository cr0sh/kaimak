// https://stackoverflow.com/a/9517879

var s = document.createElement('script');
// TODO: This won't work on metadata V3 because of CSP. Should follow Metamask's V3 integration. ref: https://github.com/MetaMask/metamask-extension/issues/13411
s.textContent = `(${injectKaimak})();`;
s.setAttribute("async", "false");
s.onload = function () {
    this.remove();
};

var m = document.createElement('meta');
m.setAttribute("kaimak-extension-id", chrome.runtime.id);

var c = document.createElement('script');
c.src = chrome.runtime.getURL("caver.min.js");
c.onload = function () {
    this.remove();
}

let container = (document.head || document.documentElement);
container.insertBefore(s, container.children[0]);
container.appendChild(m);
container.appendChild(c);

function injectKaimak() {
    let __kaimak_enable = window.ethereum.enable;
    let __kaimak_installed = false;
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
                return __kaimak_enable().then((addrs) => {
                    window.klaytn.selectedAddress = addrs[0];
                    window.klaytn.emit("accountsChanged", addrs);
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
            if (name in target) {
                return target[name];
            }
            return window.ethereum[name];
        }
    };

    window.klaytn = new Proxy(__kaimak_kaikas, __kaimak_handler);
}