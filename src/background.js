let isWindowCreated = false;
let tabData;

let createdTabId;

let activeTabId = null;

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

//chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
//  if (!activeTabId) return;
//  // Enables the side panel only on tab ID
//  if (tab.id !== activeTabId) {
//    console.log("BG: tab changed, closing sidePanel");
//    // Disables the side panel on all other sites
//    await chrome.sidePanel.setOptions({
//      tabId,
//      enabled: false
//    });
//  }
//});

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
    });
  }

});
