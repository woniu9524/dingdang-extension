import { processBatch, tokenizeText } from '@pages/content/injected/annotate/textProcessUtils';
import wordsStorage, { ExtensionWord } from '@src/shared/storages/WordsStorage';
import { createPageHandle, showWordCard } from '@pages/content/ui/root';

// 定义注释配置的接口
export interface AnnotateConfig {
  lazeMode: boolean; // 懒惰模式标志
  annotateType: string; // 注释类型
  annotateFrequency: number; // 注释频率
  useUnderline: boolean; // 是否使用下划线
  useTextHighlight: boolean; // 是否使用文本高亮
  useBold: boolean; // 是否使用粗体
  targetLanguage: string; // 目标语言
  sourceLanguage: string; // 源语言
  lemmatize: boolean; // 是否进行词元化
}

// 处理注释的主函数，根据配置和目标语言标志执行注释处理
export async function handleAnnotate(settings: AnnotateConfig, isTargetLanguage: boolean): Promise<void> {
  const words = await wordsStorage.get(); // 获取单词存储
  const {
    stopWords,
    targetLanguageWords,
    simpleTargetLanguageWords,
    sourceLanguageWords,
    simpleSourceLanguageWords,
    extensionWords
  } = words;

  // 根据是否为目标语言选择相应的单词列表
  const languageWords = isTargetLanguage
    ? (settings.lazeMode ? targetLanguageWords : simpleTargetLanguageWords)
    : (settings.lazeMode ? sourceLanguageWords : simpleSourceLanguageWords);

  // 如果不是目标语言，移除长度小于等于1的单词
  if (!isTargetLanguage) {
    for (const key in languageWords) {
      if (key.length <= 1) {
        delete languageWords[key];
      }
    }
  }

  // 创建停用词集合，并过滤语言单词列表中的停用词
  const stopWordsSet = new Set(stopWords);
  for (const key in languageWords) {
    languageWords[key] = [...new Set(languageWords[key].filter(word => !stopWordsSet.has(word)))];
  }

  const wordList: ExtensionWord[] = []; // 扩展单词列表
  const wordAdded = {}; // 已添加单词记录

  // 获取翻译函数，根据配置和单词列表返回翻译后的单词或注释
  const getTranslation = (word, languageWords, extensionWords, settings) => {
    const translations = languageWords[word] || [];
    const translation = translations[Math.floor(Math.random() * translations.length)];
    const extensionWord = extensionWords[isTargetLanguage ? word : translation] || {};
    if (!translation) return word;
    const flag=Math.random() * 100 < settings.annotateFrequency;
    if (flag) {
      if (!wordAdded[word]) {
        wordList.push(extensionWord);
        wordAdded[word] = true;
        return isTargetLanguage
          ? renderTargetLanguageTextNode(word, word, translation, settings)
          : renderSourceLanguageTextNode(word, word, translation, settings);
      }
    }
    return word;
  };

  // 批量处理文本节点，进行替换和注释
  await processBatch((textNode) => {
    const text = textNode.textContent;
    if (!text) return;

    const shouldTokenize = ['en'].includes(isTargetLanguage ? settings.targetLanguage : settings.sourceLanguage);
    let replacedText;

    if (shouldTokenize) {
      const tokens = tokenizeText(text, isTargetLanguage ? settings.targetLanguage : settings.sourceLanguage, settings.lemmatize);
      replacedText = tokens.map(({ original, lemmatized }) => {
        const word = settings.lemmatize ? lemmatized : original;
        return getTranslation(word, languageWords, extensionWords, settings);
      }).join(' ');
    } else {
      const keys = Object.keys(languageWords).join('|');
      const replacePattern = new RegExp(`(?:${keys})`, 'g');
      replacedText = text.replace(replacePattern, match => getTranslation(match, languageWords, extensionWords, settings));
    }
    updateTextNode(textNode, replacedText, extensionWords,settings.lazeMode); // 更新文本节点
  }, 10);

  await createPageHandle(wordList); // 创建页面句柄
}

// 处理目标语言注释
export async function handleTargetLanguageAnnotate(settings: AnnotateConfig): Promise<void> {
  return handleAnnotate(settings, true);
}

// 处理源语言注释
export async function handleSourceLanguageAnnotate(settings: AnnotateConfig): Promise<void> {
  return handleAnnotate(settings, false);
}

// 更新文本节点，将替换后的文本插入到原节点位置
function updateTextNode(textNode, replacedText, extensionWords,lazyMode) {
  if (textNode.textContent !== replacedText) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = replacedText;

    while (tempElement.firstChild) {
      textNode.parentNode.insertBefore(tempElement.firstChild, textNode);
    }
    textNode.parentNode.removeChild(textNode);

    // 为注释的单词添加点击事件，显示单词卡片
    document.querySelectorAll('[data-original]').forEach(element => {
      element.addEventListener('click', function() {
        const isSourceLanguage = this.className.includes('source-language-annotation');
        const originalWord = isSourceLanguage
          ? this.getAttribute('data-translation')
          : this.getAttribute('data-original');

        const rect = this.getBoundingClientRect();
        showWordCard(extensionWords[originalWord],lazyMode, rect.left, rect.bottom);
      });
    });
  }
}

// 渲染文本节点，根据配置返回相应的HTML结构
function renderTextNode(baseClass, additionalClass, original, translation, settings, isTargetLanguage) {
  const { useUnderline, useTextHighlight, useBold, annotateType } = settings;
  let targetClass = `processed-dingdang anchor-${original} anchor-${translation}`;
  if (useUnderline) targetClass += ' ding-underline';
  if (useTextHighlight) targetClass += ' ding-highlight';
  if (useBold) targetClass += ' ding-bold-text';

  const additionalAttributes = `data-original="${original}" data-translation="${translation}"`;
  let renderedText = '';

  switch (annotateType) {
    case 'annotateOnly':
      renderedText = `<span class="${baseClass} ${targetClass} ${additionalClass}" ${additionalAttributes}>${original}</span>`;
      break;
    case 'topChinese':
    case 'topEnglish':
      renderedText = `<ruby class="${baseClass} ${additionalClass}" ${additionalAttributes}><span class="${targetClass}">${original}</span><rt class="rt-style">${translation}</rt></ruby>`;
      break;
    case 'sideChinese':
    case 'sideEnglish':
      renderedText = `<span class="${baseClass} ${targetClass} ${additionalClass}" ${additionalAttributes}>${original}(${translation})</span>`;
      break;
    case 'replaceChinese':
      if (!isTargetLanguage) {
        renderedText = `<span class="${baseClass} ${targetClass} ${additionalClass}" ${additionalAttributes}>${translation}</span>`;
      }
      break;
    default:
      renderedText = original;
  }

  return renderedText;
}

// 渲染目标语言文本节点
function renderTargetLanguageTextNode(original, lemmatized, translation, settings) {
  return renderTextNode('target-language-annotation', '', original, translation, settings, true);
}

// 渲染源语言文本节点
function renderSourceLanguageTextNode(original, lemmatized, translation, settings) {
  return renderTextNode('source-language-annotation', '', original, translation, settings, false);
}

// 还原所有标记的单词到原始状态
export function resetAnnotations() {
  const annotatedElements = document.querySelectorAll('[data-original]');
  annotatedElements.forEach(element => {
    // 恢复原始文本
    element.textContent = element.getAttribute('data-original');

    // 移除所有附加的样式和类
    element.removeAttribute('class');
    element.removeAttribute('data-original');
    element.removeAttribute('data-translation');

    // 移除把手dingdang-handle-root
    const handle = document.querySelector('.dingdang-handle-root');
    if (handle) {
      handle.remove();
    }
  });
}
