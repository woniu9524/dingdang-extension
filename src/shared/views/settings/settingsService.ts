export function createWebsiteRulesDropdownItems(domain: string) {
  try {
    return [
      { key: 'default', content: `网站规则 默认: ${domain}` },
      { key: 'alwaysAnnotateEnglish', content: `总是标注英文: ${domain}`, color: 'green' },
      { key: 'neverAnnotateEnglish', content: `总不标注英文: ${domain}`, color: 'red' },
      { key: 'alwaysAnnotateChinese', content: `总是标注中文: ${domain}`, color: 'green' },
      { key: 'neverAnnotateChinese', content: `总不标注中文: ${domain}`, color: 'red' },
    ];
  } catch (error) {
    console.error(error);
    return []; // 出错时返回空数组
  }
}

// 获取当前网站的域名
export const getDomainAsync = async () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length === 0) {
        reject(new Error('No active tab found'));
        return;
      }
      const currentTab = tabs[0];
      const url = new URL(currentTab.url);
      const hostname = url.hostname;
      resolve(hostname);
    });
  });
};
