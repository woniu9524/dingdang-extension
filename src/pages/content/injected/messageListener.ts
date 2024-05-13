/*
*  content页面消息监听
* */

// 将请求类型映射到它们各自的处理函数
import {
  handleSourceLanguageAnnotate,
  handleTargetLanguageAnnotate,
} from '@pages/content/injected/annotate/textProcessor';
import { findWordInHtml } from '@pages/content/injected/annotate/textProcessUtils';
import { handleMessage } from '@src/shared/utils/MessagingTool';

const requestHandlers = {
  'settings-annotateTargetLanguage': async (data) => {
    console.log('settings-annotateTargetLanguage', data);
    // 标注英文
    await handleTargetLanguageAnnotate(data);
    return {};
  },
  'settings-annotateSourceLanguage': async (data) => {
    // 标注中文
    console.log('settings-annotateSourceLanguage', data);
    await handleSourceLanguageAnnotate(data);
    return {};
  },

  'findWord': async (data) => {
    // 标注中文
    findWordInHtml(data);
    return {};
  },
};


// 监听来自内容脚本的消息
handleMessage((message, sender, sendResponse) => {
  const handler = requestHandlers[message.type];
  if (handler) {
    try {
      sendResponse(handler(message.data));
    } catch (error) {
      console.error('处理请求时发生错误:', message.type, error);
    }
  } else {
    console.error('未处理的请求类型:', message.type);
  }
});
