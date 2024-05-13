import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'GET_STATE':
      break;
    case 'UPDATE_WORD_LIST':
      sendResponse({ success: true });
      break;
    case 'SET_MENU':
      sendResponse({ success: true });
      break;
    case 'SET_HAS_OPEN_SIDE':
      sendResponse({ success: true });
      break;
    default:
      sendResponse({ success: false, message: 'Unknown action' });
  }
});
