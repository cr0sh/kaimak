chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.search(/https?:\/\/(baobab\.)?scope\.klaytn\.com\/address\//) === 0) {
        chrome.tabs.update(tabId, { url: tab.url.replace("/address/", "/account/") });
    }
});