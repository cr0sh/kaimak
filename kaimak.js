// https://stackoverflow.com/a/9517879

var s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function () {
    this.remove();
};

var m = document.createElement('meta');
m.setAttribute("kaimak-extension-id", chrome.runtime.id);

(document.head || document.documentElement).appendChild(s);
(document.head || document.documentElement).appendChild(m);