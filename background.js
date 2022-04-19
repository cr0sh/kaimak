chrome.tabs.onUpdated.addListener(function (tabId, _changeInfo, tab) {
    if (tab.url.search(/https?:\/\/(baobab\.)?scope\.klaytn\.com\/address\//) === 0) {
        chrome.tabs.update(tabId, { url: tab.url.replace("/address/", "/account/") });
    }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (!tab.url.startsWith("http")) {
        return;
    }

    if (changeInfo.status !== "loading") {
        return;
    }

    chrome.scripting.executeScript({
        target: { tabId: tabId },
        world: "MAIN",
        files: ["kaimak.js"],
    });
});