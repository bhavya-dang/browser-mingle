// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openNewWindow') {
        openNewWindow();
    }
});

function openNewWindow() {
    chrome.windows.create({
        url: 'index.html',
        type: 'popup',
        width: 400,
        height: 400
    });
}
