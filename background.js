chrome.runtime.onInstalled.addListener(function () {
    console.log("Extension installed or updated.");
});

chrome.commands.onCommand.addListener(function (command) {
    if (command === "toggle_popup") {
        chrome.tabs.create({ url: "index.html" });
    }
});
