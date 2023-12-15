let isWindowCreated = false;
let tabData;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!isWindowCreated && request.type === "action" && request.action === "openNewWindow") {
    isWindowCreated = true;

    chrome.tabs.create({ url: "index.html", active: false }, (newTab) => {
      chrome.windows.create({
        tabId: newTab.id,
        type: "popup",
        focused: true,
        width: 500,
      });
    });
  }

  if (request.type === "contentscript_tab_data_send") {
    console.log("BG: received data from content script:", request.data);
    tabData = request.data;
  }

  if (request.type === "window_closed") {
    console.log("BG: window close detected")
    isWindowCreated = false;
  }

  if (request.type === "window_tab_data_request") {
    sendResponse(tabData)
  }
});
