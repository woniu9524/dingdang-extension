
export function getCurrentDomain(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.url) {
        try {
          const url = new URL(currentTab.url);
          const hostname = url.hostname;
          resolve(hostname);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('No active tab found or tab URL is undefined'));
      }
    });
  });
}


export function cleanTranslation(translation) {
  // 去除空格
  translation = translation.replace(/\s+/g, '');
  // 去除中文括号
  translation = translation.replace(/（.*?）/g, '');
  // 去除英文括号
  translation = translation.replace(/\(.*?\)/g, '');
  // 去除〈〉
  translation = translation.replace(/〈.*?〉/g, '');
  // 去除<> 和内部内容
  translation = translation.replace(/<.*?>/g, '');
  // 去除【】 和内部内容
  translation = translation.replace(/【.*?】/g, '');
  // 去除[]和内部内容
  translation = translation.replace(/\[.*?\]/g, '');
  // 去除&
  translation = translation.replace(/&/g, '');
  // 去除adv. adj. n. v. vi 等词性标记
  translation = translation.replace(/(adv|pron|conj|abbr)\./g, '');
  translation = translation.replace(/(adj|n|v|vi|vt|prep)\./g, '');
  // 按照逗号和分号分隔
  translation = translation.split(/[,;，；]/);
  // 去除空字符串
  translation = translation.filter((item) => item !== '');
  return translation;
}


