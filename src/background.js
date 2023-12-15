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

      console.log("BG: created BrowserMingle tab with ID", createdTabId);
    });
  }

  if (request.type === "contentscript_tab_data_send") { // receive new tab data
    console.log("BG: received data from content script:", request.data);
    tabData = request.data;
  }

  if (request.type === "window_tab_data_request") { // send tabData to window when it requests it
    sendResponse(tabData)
  }

  if (request.type === "contentscript_tab_closed" && createdTabId) { // when content script detects browser tab close, close the chat window too
    let createdTabId_tmp_for_log = createdTabId;
    chrome.tabs.remove(createdTabId, function() {
      console.log('Closed BrowserMingle tab with ID:', createdTabId_tmp_for_log);
    });

    isWindowCreated = false; // window closed, ready to create new one
    createdTabId = null;

    sendResponse({ message: "destroyed Extension window :3" });
  }
});
