import nlp from 'compromise';


// 定义TextNodeCallback类型，用于描述处理文本节点的回调函数
type TextNodeCallback = (node: Text) => void;

/**
 * 遍历网页中的文本节点
 * @param node 开始遍历的节点
 * @param callback 对每个文本节点执行的回调函数
 */
export function walkTextNodes(node: Node, callback: TextNodeCallback): void {
  if (node.nodeType === Node.TEXT_NODE) {
    // 如果当前文本节点的父元素没有包含 'processed-dingdang' 或者 'processed-dingdang-never'类名，才执行回调函数
    if(!node.parentElement ||
      (!node.parentElement.classList.contains('processed-dingdang') &&
        !node.parentElement.classList.contains('processed-dingdang-never')))
    {
      callback(node as Text);
    }
  } else {
    node.childNodes.forEach(childNode => {
      walkTextNodes(childNode, callback);
    });
  }
}


/**
 * 检查元素是否已被处理
 * @param element 要检查的元素
 * @returns 是否已处理
 */
function isElementProcessed(element: Element): boolean {
  return element.classList.contains('processed-dingdang');
}

/**
 * 选择页面上特定标签的所有元素。
 *
 * @returns 选中元素的数组。
 */
function selectElementsToProcess(): Element[] {
  const selector = 'p, h1, h2, h3, h4, h5, h6, li, td, th, pre, blockquote, span, a, div, br';
  return Array.from(document.querySelectorAll(selector));
}


/**
 * 批量处理元素数组中的每个元素，对每个元素执行指定的文本节点处理函数。
 * @param processTextNode 对每个文本节点执行的处理函数。
 * @param batchSize 每批处理的最大元素数量，默认为10。
 */
export async function processBatch(processTextNode, batchSize = 10, elementsToProcess = null) {
  // 创建一个可以使用 await 的 Promise 包装版本的 requestIdleCallback
  await new Promise<void>(resolve => window.requestIdleCallback(async (deadline) => {
    if (!elementsToProcess) {
      elementsToProcess = selectElementsToProcess().filter(el => !isElementProcessed(el));
    }

    const elements = elementsToProcess.slice(0, batchSize);
    while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && elements.length > 0) {
      const element = elements.shift();
      if (element) {
        // 此处假设 walkTextNodes 和 markElementAsProcessed 也被改造为异步函数
        await walkTextNodes(element, processTextNode);
        elementsToProcess.shift();
      }
    }

    if (elementsToProcess.length > 0) {
      await processBatch(processTextNode, batchSize, elementsToProcess);
    }

    resolve(); // 解析 Promise，以便可以继续执行
  }, { timeout: 10000 }));
}


export function tokenizeText(text: string, language: string, lemmatized: boolean = false) {
  // 按空格分词
  if (text == 'undefined' || text == null || text == '') {
    return [];
  }
  lemmatized = true;
  const words = text.split(/\s+/g);
  // 如果需要词形还原，且是英语
  if (language === '英语' && lemmatized) {
    // 词形还原结果数组
    const lemmatizedResults = words.map(word => {
      // 将单词转换为Compromise文档对象
      const wordDoc = nlp(word);
      // 尝试还原动词到其不定式
      let lemma = wordDoc.verbs().toInfinitive().out('text');
      // 如果结果未改变，尝试将名词还原到单数形式
      if (lemma === word) {
        lemma = wordDoc.nouns().toSingular().out('text');
      }
      // 如果还是没有变化，就使用原词
      if (lemma === word) {
        lemma = word; // 如果词未变，保留原样
      }
      return { original: word, lemmatized: lemma };
    });

    return lemmatizedResults;
  }
  // 对于不需要词形还原的情况，或不是英语，返回原始单词
  return words.map(word => ({ original: word, lemmatized: word }));
}


export function findWordInHtml(word: string) {
  const elements = document.getElementsByClassName('anchor-' + word);
  // 滚动到目标元素
  if (elements[0]) {
    elements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (!elements[0].className.includes('ding-search-hit')) {
      elements[0].className += ' ding-search-hit';
    }
    elements[0].className = elements[0].className.replace(/\bding-highlight\b/g, '');
  }

}
