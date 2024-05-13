
export function getCurrentDomain(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    console.log('tabs', tabs);
    const currentTab = tabs[0];
    if (currentTab) {
        // 使用 URL 对象解析当前标签页的网址
        const url = new URL(currentTab.url);
        // 获取主机名
        const hostname = url.hostname;
        callback(hostname);
      }
    },
  );
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


