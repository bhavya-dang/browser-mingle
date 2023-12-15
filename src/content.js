// Get current tab data and send to background script

const tabData = {
  title: document.title,
  uri: document.baseURI
};

chrome.runtime.sendMessage({ type: "contentscript_tab_data_send", data: tabData });

// Add an event listener for the beforeunload event (detecting browser tab close)
window.addEventListener('beforeunload', function(event) {
  chrome.runtime.sendMessage({ type: 'contentscript_tab_closed' });
});
