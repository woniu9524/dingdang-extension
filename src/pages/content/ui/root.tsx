// 引入 React DOM 的 createRoot 方法，用于创建根渲染容器
import { createRoot } from 'react-dom/client';
// 引入 App 组件，这是我们的主要 UI 组件
// 引入一个用于在特定条件下自动刷新页面的模块，以保证最新的内容被展示
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

// 引入样式文件，这里使用了特殊的查询参数 `?inline` 来直接将样式内容注入到 JavaScript 中
import injectedStyle from './injected.css?inline';
import ContentWordCard from '@src/shared/components/ConentWordCard/ContentWordCard';
import { ExtensionWord } from '@src/shared/storages/WordsStorage';
import DrawerSidebar from '@src/shared/views/sidebar/DrawerSidebar';
import ContentWordCardMobile from '@src/shared/components/ConentWordCard/ContentWordCardMobile';
// 调用 refreshOnUpdate 函数，当 'pages/content' 页面的内容发生变化时，自动刷新页面
refreshOnUpdate('pages/content');

// 创建一个新的 div 元素，用作 React 应用的挂载点
const root = document.createElement('div');
// 为这个 div 元素设置一个独特的 id，以便于识别
root.id = 'chrome-extension-dingdang-content-view-root';

// 将创建的 div 元素添加到 document 的 body 中，使其成为页面的一部分
document.body.append(root);

// 再创建一个 div 元素，用于作为 Shadow DOM 的挂载点
const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

// 通过调用 attachShadow 方法并设置模式为 'open'，在 root 元素上创建 Shadow DOM
// Shadow DOM 允许我们将一些 DOM 结构附加到元素上，但这些结构在页面的主 DOM 树中是隔离的
const shadowRoot = root.attachShadow({ mode: 'open' });
// 将 rootIntoShadow 元素添加到 Shadow DOM 中
shadowRoot.appendChild(rootIntoShadow);

// 创建一个 style 元素，用于存放和应用样式
/** 将样式注入到 Shadow DOM 中 */
const styleElement = document.createElement('style');
// 将之前引入的样式内容赋值给 style 元素的 innerHTML
styleElement.innerHTML = injectedStyle;
// 将 style 元素添加到 Shadow DOM 中，这样样式只会应用到 Shadow DOM 内部的元素，不影响外部元素
shadowRoot.appendChild(styleElement);

/**
 * 在 Firefox 环境中，adoptedStyleSheets 的 bug 可能会阻止 contentStyle 被正确应用。
 * 请参考上述 PR 链接，了解更多背景信息和可能的解决方案。
 * 如果你有更好的改进方法，欢迎提交 PR。
 */

// 使用 createRoot 方法在 rootIntoShadow 上创建一个 React 根容器，并渲染 App 组件
// 这里，App 组件和它的所有子组件都会被渲染到 Shadow DOM 内部，享受样式隔离的好处
//createRoot(rootIntoShadow).render(<BackButton />);


export async function createPageHandle(wordList: ExtensionWord[],openDrawer:boolean=false) {
  const existingRoot = document.getElementById('dingdang-handle-root');
  if (existingRoot) {
    existingRoot.remove();
  } else {
    const root = document.createElement('div');
    root.id = 'dingdang-handle-root';
    document.body.appendChild(root);

    const shadowRoot = root.attachShadow({ mode: 'open' });
    const rootIntoShadow = document.createElement('div');
    shadowRoot.appendChild(rootIntoShadow);
    createRoot(rootIntoShadow).render(<DrawerSidebar wordList={wordList} openDrawer={openDrawer} />);
  }
}

export function showWordCard(extendWord: ExtensionWord, lazyMode: boolean, x: number, y: number) {
  const cardRoot = document.createElement('div');
  document.body.appendChild(cardRoot);

  // 设置基础样式
  cardRoot.style.position = 'absolute';
  cardRoot.style.zIndex = '1000'; // 确保组件在最上层

  const isMobile = window.innerWidth <= 768; // 设定手机屏幕的宽度阈值

  if (!isMobile) {
    cardRoot.style.left = `${x}px`;
  } else {
    cardRoot.style.left = '50%';
    cardRoot.style.transform = 'translateX(-50%)'; // 水平居中
  }

  // 创建根节点并渲染对应组件
  const root = createRoot(cardRoot);
  root.render(
    isMobile ?
      <ContentWordCardMobile
        word={extendWord.word}
        translation={extendWord.translation}
        example={extendWord.sentence}
        exampleTranslation={extendWord.sentenceTranslation}
        onClose={() => {
          root.unmount();
          document.body.removeChild(cardRoot);
        }}
      /> :
      <ContentWordCard
        word={extendWord.word}
        translation={extendWord.translation}
        example={extendWord.sentence}
        exampleTranslation={extendWord.sentenceTranslation}
        onClose={() => {
          root.unmount();
          document.body.removeChild(cardRoot);
        }}
      />
  );

  // 等待组件渲染完成后，调整top值
  setTimeout(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    cardRoot.style.top = isMobile ? `${scrollY}px` : `${y + scrollY}px`; // 手机顶部弹出，PC在单词下方
  }, 0);
}
