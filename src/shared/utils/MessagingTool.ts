export function sendMessageToBackground(type, data) {
  chrome.runtime.sendMessage({ type, data });
}

export function sendMessageToPopup(type, data) {
  chrome.runtime.sendMessage({ type, data });
}

export function sendMessageToContent(type, data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type, data });
  });
}

export function handleMessage(callback) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    callback(message, sender, sendResponse);
    return true; // to enable asynchronous response
  });
}
