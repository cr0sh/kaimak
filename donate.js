window.addEventListener("load", function () {
    this.document.querySelector("#coffee-link").addEventListener("click", donate);
})

async function donate() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        world: "MAIN", func:
            () => {
                if (window.klaytn === undefined || !window.klaytn._kaikas.isEnabled()) {
                    return;
                }

                window.klaytn.sendAsync({
                    method: "klay_sendTransaction",
                    params: [{
                        gas: "0x2710",
                        from: window.klaytn.selectedAddress,
                        to: "0xB038E798Dd142EA6b3183c87d78B12D58F65F629".toLowerCase(),
                        value: "0xff",
                    }]
                });
            }
    })
}