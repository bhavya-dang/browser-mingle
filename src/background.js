let isWindowCreated = false;
let tabData;

let createdTabId;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!isWindowCreated && request.type === "action" && request.action === "openNewWindow") {
    isWindowCreated = true;

    chrome.tabs.create({ url: "index.html", active: false }, (newTab) => {
      createdTabId = newTab.id; // storing extension tab ID

      chrome.windows.create({
        tabId: newTab.id,
        type: "popup",
        focused: true,
        width: 500,
      }); // creating window from tab
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

  if (request.type === "contentscript_tab_closed") {
    chrome.tabs.remove(createdTabId, function() {
      console.log('Closed BrowserMingle tab with ID:', createdTabId);
    });

    isWindowCreated = false;

    sendResponse({ message: "destroyed Extension window :3" });
  }
});
