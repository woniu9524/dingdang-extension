import { processBatch, tokenizeText } from '@pages/content/injected/annotate/textProcessUtils';
import wordsStorage, { DictionaryOfExtensionWordArray, ExtensionWord } from '@src/shared/storages/WordsStorage';
import { createPageHandle, showWordCard } from '@pages/content/ui/root';


export interface AnnotateConfig {
  lazeMode: boolean;
  annotateType: string;
  annotateFrequency: number;
  useUnderline: boolean;
  useTextHighlight: boolean;
  useBold: boolean;
  targetLanguage: string;
  sourceLanguage: string;
  lemmatize: boolean;
}


export async function handleTargetLanguageAnnotate(settings: AnnotateConfig): Promise<void> {
  const words = await wordsStorage.get();
  const { stopWords, targetLanguageWords, simpleTargetLanguageWords,extensionWords } = words;
  // 根据配置选择词汇表
  const languageWords = settings.lazeMode ? targetLanguageWords : simpleTargetLanguageWords;
  // 通过删除停用词来去重词汇表
  stopWords.forEach((stopWord) => {
    delete languageWords[stopWord];
  });
  // 单词清单
  const wordList: ExtensionWord[] = [];
  // 已处理单词的跟踪对象
  const wordAdded = {};

  // 将翻译和注释逻辑集中到一个函数中
  const getTranslation = (word, languageWords,extensionWords, settings) => {
    const extensionWord = extensionWords[word] || {};
    const translations = languageWords[word] || [];
    const translation = translations[Math.floor(Math.random() * translations.length)];
    if (!translation) return word;
    // 如果随机值小于注释频率，则返回注释文本，否则返回原文
    if (Math.random() * 100 < settings.annotateFrequency) {
      // 检查单词是否已经加入到wordList中
      if (!wordAdded[word]) {
        wordList.push(extensionWord);
        wordAdded[word] = true; // 标记为已添加
        return renderTargetLanguageTextNode(word, word, translation, settings);
      }

    }
    return word;
  };

  // 处理每个文本节点
  await processBatch((textNode) => {
    const text = textNode.textContent;
    if (!text) return;

    // 根据目标语言判断是否需要分词处理
    const shouldTokenize = ['en'].includes(settings.targetLanguage);
    let replacedText;

    if (shouldTokenize) {
      // 分词，并根据设置可能进行词形还原
      const tokens = tokenizeText(text, settings.targetLanguage, settings.lemmatize);
      replacedText = tokens.map(({ original, lemmatized }) => {
        const targetWord = settings.lemmatize ? lemmatized : original;
        // 获取翻译并生成注释文本或返回原文
        return getTranslation(targetWord, languageWords,extensionWords, settings);
      }).join(' ');
    } else {
      // 如果不需要分词，直接使用正则表达式进行全文替换
      const keys = Object.keys(languageWords).join('|');
      const replacePattern = new RegExp(`(?:${keys})`, 'g');
      replacedText = text.replace(replacePattern, match => getTranslation(match, languageWords,extensionWords, settings));
    }
    // 更新文本节点内容
    updateTextNode(textNode, replacedText, extensionWords);

  }, 10);

  // 单词清单把手
  await createPageHandle(wordList);
}


export async function handleSourceLanguageAnnotate(settings: AnnotateConfig): Promise<void> {
  const words = await wordsStorage.get();
  const { stopWords, sourceLanguageWords, simpleSourceLanguageWords, targetLanguageWords,extensionWords } = words;

  // 根据配置选择词汇表
  const languageWords = settings.lazeMode ? sourceLanguageWords : simpleSourceLanguageWords;
  // languageWords中的key长度应该大于1
  for (const key in languageWords) {
    if (key.length <= 1) {
      delete languageWords[key];
    }
  }

  // 通过删除停用词来去重词汇表
  const stopWordsSet = new Set(stopWords);
  for (const key in languageWords) {
    // 将数组转换为Set去除重复项，然后过滤掉停用词，最后转回数组
    languageWords[key] = [...new Set(languageWords[key].filter(word => !stopWordsSet.has(word)))];
  }
  // 单词清单
  const wordList: ExtensionWord[] = [];
  // 已处理单词的跟踪对象
  const wordAdded = {};
  // 将翻译和注释逻辑集中到一个函数中
  const getTranslation = (word, languageWords,extensionWords, settings) => {
    const translations = languageWords[word] || [];
    const translation = translations[Math.floor(Math.random() * translations.length)];
    const extensionWord = extensionWords[translation] || {};
    if (!translation) return word;
    // 如果随机值小于注释频率，则返回注释文本，否则返回原文
    if (Math.random() * 100 < settings.annotateFrequency) {
      // 检查单词是否已经加入到wordList中
      if (!wordAdded[word]) {
        wordList.push(extensionWord);
        wordAdded[word] = true; // 标记为已添加
        return renderSourceLanguageTextNode(word, word, translation, settings);
      }
    }
    return word;
  };

  // 处理每个文本节点
  await processBatch((textNode) => {
    const text = textNode.textContent;
    if (!text) return;
    // 根据目标语言判断是否需要分词处理
    const shouldTokenize = ['en'].includes(settings.sourceLanguage);
    let replacedText;

    if (shouldTokenize) {
      // 分词，并根据设置可能进行词形还原
      const tokens = tokenizeText(text, settings.sourceLanguage, settings.lemmatize);
      replacedText = tokens.map(({ original, lemmatized }) => {
        const sourceWord = settings.lemmatize ? lemmatized : original;
        // 获取翻译并生成注释文本或返回原文
        return getTranslation(sourceWord, languageWords,extensionWords, settings);
      }).join(' ');
    } else {
      // 如果不需要分词，直接使用正则表达式进行全文替换
      const keys = Object.keys(languageWords).join('|');
      const replacePattern = new RegExp(`(?:${keys})`, 'g');
      replacedText = text.replace(replacePattern, match => getTranslation(match, languageWords,extensionWords, settings));
    }

    // 更新文本节点内容
    updateTextNode(textNode, replacedText, extensionWords);

  }, 10);

  // 单词清单把手
  await createPageHandle(wordList);
}


// 更新文本节点内容
function updateTextNode(textNode, replacedText,extensionWords) {
  if (textNode.textContent !== replacedText) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = replacedText;

    // 替换原有的文本节点
    while (tempElement.firstChild) {
      textNode.parentNode.insertBefore(tempElement.firstChild, textNode);
    }
    textNode.parentNode.removeChild(textNode);

    // 为所有标记了data-original属性的元素添加点击事件监听器
    document.querySelectorAll('[data-original]').forEach(element => {
      element.addEventListener('click', function() {
        let originalWord = '';
        // 获取是否存在class属性source-language-annotation
        const isSourceLanguage = this.className.includes('source-language-annotation');
        // 如果是源语言，则使用原文作为单词
        if (isSourceLanguage) {
          originalWord = this.getAttribute('data-translation');
        } else {
          originalWord = this.getAttribute('data-original');
        }

        const rect = this.getBoundingClientRect(); // 获取元素的位置和尺寸
        // 使用元素的位置作为WordCard的显示位置
        showWordCard(extensionWords[originalWord], rect.left, rect.bottom);
      });
    });
  }
}


// 渲染目标语言文本节点
function renderTargetLanguageTextNode(original: string, lemmatized: string, translation: string, settings: AnnotateConfig): string {
  const { useUnderline, useTextHighlight, useBold, annotateType, lemmatize } = settings;
  const baseClass = 'target-language-annotation';
  let targetClass = 'processed-dingdang anchor-' + original;
  if (useUnderline) {
    targetClass += ' ding-underline';
  }
  if (useTextHighlight) {
    targetClass += ' ding-highlight';
  }
  if (useBold) {
    targetClass += ' ding-bold-text';
  }
  let renderedText = '';
  // 根据设置决定是否显示词形还原前后的文本
  //const displayText = lemmatize && original !== lemmatized ? `${original}(${lemmatized})` : original;
  // 构造额外的属性字符串
  const additionalAttributes = `data-original="${original}" data-translation="${translation}"`;
  console.log(original, lemmatized);
  switch (annotateType) {
    case 'annotateOnly':
      renderedText = `<span class="${baseClass} ${targetClass} " ${additionalAttributes}>${original}</span>`;
      break;
    case 'topChinese':
      renderedText = `<ruby class="${baseClass} " ${additionalAttributes}><span class="${targetClass}">${original}</span><rt class="rt-style">${translation}</rt></ruby>`;
      break;
    case 'sideChinese':
      renderedText = `<span class="${baseClass} ${targetClass}" ${additionalAttributes}>${original}(${translation})</span>`;
      break;
    default:
      renderedText = original;
  }

  return renderedText;
}


function renderSourceLanguageTextNode(original: string, lemmatized: string, translation: string, settings: AnnotateConfig): string {
  const { useUnderline, useTextHighlight, useBold, annotateType, lemmatize } = settings;
  const baseClass = 'source-language-annotation ';
  let sourceClass = 'processed-dingdang anchor-' + translation;
  if (useUnderline) {
    sourceClass += ' ding-underline';
  }
  if (useTextHighlight) {
    sourceClass += ' ding-highlight';
  }
  if (useBold) {
    sourceClass += ' ding-bold-text';
  }
  let renderedText = '';
  // 构造额外的属性字符串
  const additionalAttributes = `data-original="${original}" data-translation="${translation}"`;

  switch (annotateType) {
    case 'annotateOnly':
      renderedText = `<span class="${baseClass} ${sourceClass}" ${additionalAttributes}>${original}</span>`;
      break;
    case 'topEnglish':
      renderedText = `<ruby class="${baseClass} " ${additionalAttributes}><span class="${sourceClass}">${original}</span><rt class="rt-style">${translation}</rt></ruby>`;
      break;
    case 'sideEnglish':
      renderedText = `<span class="${baseClass} ${sourceClass}" ${additionalAttributes}>${original}(${translation})</span>`;
      break;
    case 'replaceChinese':
      renderedText = `<span class="${baseClass} ${sourceClass}" ${additionalAttributes}>${translation}</span>`;
      break;
    default:
      renderedText = original;
  }

  return renderedText;
}



