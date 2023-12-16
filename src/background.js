let isWindowCreated = false;
let tabData;

let createdTabId;

let activeTabId = null;

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.type === "contentscript_tab_data_send") { // receive new tab data
    console.log("BG: received data from content script:", request.data);
    tabData = request.data;
  }

  if (request.type === "window_tab_data_request") { // send tabData to window when it requests it
    sendResponse(tabData)

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      activeTabId = activeTab.id; // or do whatever you need
      console.log("BG: active tab ID is", activeTabId);
    });
  }

});
