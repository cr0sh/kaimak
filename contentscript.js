// https://stackoverflow.com/a/9517879

var m = document.createElement('meta');
m.setAttribute("kaimak-extension-id", chrome.runtime.id);

var c = document.createElement('script');
c.src = chrome.runtime.getURL("caver.min.js");
c.onload = function () {
    this.remove();
}

let container = (document.head || document.documentElement);
container.appendChild(m);
container.appendChild(c);
