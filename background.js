chrome.runtime.onMessage.addListener((message, _sender, reply) => {
    console.log(message);
    if (message === "kaimak_success") {
        chrome.tabs.create({ url: "popup.html" });
        reply("done");
    }
});
console.log("hi");