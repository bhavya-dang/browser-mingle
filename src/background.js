let isEventHandled = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!isEventHandled && request.action === "openNewWindow") {
    isEventHandled = true;

    chrome.tabs.create({ url: "index.html", active: false }, (newTab) => {
      chrome.windows.create({
        tabId: newTab.id,
        type: "popup",
        focused: true,
        width: 500,
      });
    });
  }
});
