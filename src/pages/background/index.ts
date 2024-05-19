import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';
import { getCurrentDomain } from '@src/shared/utils/ChromExtendTool';
import { settingsManager } from '@src/shared/storages/SettingsManager';
import { AnnotateConfig } from '@pages/content/injected/annotate/textProcessor';
import { sendMessageToContent } from '@src/shared/utils/MessagingTool';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    // 获取当前标签页的 URL

    getCurrentDomain().then((domain) => {
      settingsManager.loadSettings().then((settings) => {
        const featureSettings = settings.featureSettings;
        let hasHandled = false;
        const autoOpen = featureSettings.openNewPageAutoToggle;
        const targetOpen = featureSettings.annotateTargetLanguageToggle;
        const sourceOpen = featureSettings.annotateSourceLanguageToggle;
        const rules = featureSettings.websiteRules;
        rules.forEach(rule => {
          if (rule.website === domain) {
            if (rule.rule === 'alwaysAnnotateEnglish') {
              handleOpenAnnotate(true, false);
              hasHandled = true;
            } else if (rule.rule === 'alwaysAnnotateChinese') {
              handleOpenAnnotate(false, true);
              hasHandled = true;
            } else if (rule.rule === 'neverAnnotateEnglish') {
              handleOpenAnnotate(false, autoOpen && sourceOpen);//如果自动开启，且中文标注不受网站规则影响，则中文标注开启
              hasHandled = true;
            } else if (rule.rule === 'neverAnnotateChinese') {
              handleOpenAnnotate(autoOpen && targetOpen, false);//如果自动开启，且英文标注不受网站规则影响，则英文标注开启
              hasHandled = true;
            }
          }
        });
        if (autoOpen && !hasHandled) {
          handleOpenAnnotate(targetOpen, sourceOpen);
        }
      });
    });

  }
});


const handleOpenAnnotate = async (targetOpen: boolean, sourceOpen: boolean) => {
  const settings = await settingsManager.loadSettings();
  const data: AnnotateConfig = {
    'lazeMode': settings.featureSettings.lazyModeToggle || false,
    'annotateType': settings.featureSettings.annotateTargetLanguageType,
    'annotateFrequency': settings.featureSettings.annotateFrequency || 50,
    'useUnderline': settings.featureSettings.useUnderline || false,
    'useTextHighlight': settings.featureSettings.useTextHighlight || false,
    'useBold': settings.featureSettings.useBold || false,
    'sourceLanguage': settings.sourceLanguage || '中文',
    'targetLanguage': settings.targetLanguage || '英文',
    'lemmatize': false,
  };
  if (targetOpen) {
    sendMessageToContent('settings-annotateTargetLanguage', data);
  }
  if (sourceOpen) {
    data.annotateType = settings.featureSettings.annotateSourceLanguageType;
    sendMessageToContent('settings-annotateSourceLanguage', data);
  }
};

chrome.action.onClicked.addListener(() => {
  settingsManager.loadSettings().then((settings) => {
    const openMode = settings.openMode;
    if (openMode === 'sidebarMode'){
        sendMessageToContent('settings-openSidebar',{})
    }else{
      console.log('popupMode');
      chrome.action.setPopup({ popup: "src/pages/popup/index.html" })
      chrome.action.openPopup();
    }
  })
});
