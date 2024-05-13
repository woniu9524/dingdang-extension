import React, { useEffect, useRef } from 'react';
import { CloseOutlined, SoundOutlined } from '@ant-design/icons';

interface ContentWordCardProps {
  word: string;
  translation: string;
  example?: string;
  exampleTranslation?: string;
  onClose: () => void;
}

const ContentWordCard: React.FC<ContentWordCardProps> = ({ word, translation, example, exampleTranslation, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // 使用浏览器自带的发音
  const handlePronunciation = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    } else {
      console.log('此浏览器不支持speechSynthesis API。');
    }
  };

  // 点击卡片外部关闭卡片
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose(); // 如果点击的是卡片外部，则关闭卡片
      }
    };

    // 绑定事件监听器
    document.addEventListener('mousedown', handleClickOutside);

    // 清理函数，移除事件监听器
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]); // 依赖于onClose函数

  // 处理用户对单词的操作
  const handleAction = (action: string) => {
    console.log(`用户对单词${word}执行了${action}操作`);
  };

  const highlightWords = (text: string): JSX.Element => {
    const parts = text.split(/【|】/).map((part, index) =>
      index % 2 === 1 ? <span key={index} className="word-highlight">{part}</span> : part
    );
    return <>{parts}</>;
  };

  return (
    <div className="word-card" ref={cardRef}>
      <div className="word-card-header">
        <div>单词详情</div>
        <button className="word-card-close" onClick={onClose}><CloseOutlined /></button>
      </div>
      <div className="word-card-content">
        <div>
          <span className="word-card-english">{word}</span>
          <span className="word-card-pronunciation" onClick={handlePronunciation}><SoundOutlined /></span>
        </div>
        <div className="word-card-translation">{translation}</div>
        {example && <div className="word-card-example">{highlightWords(example)}</div>}
        {exampleTranslation && <div className="word-card-example-translation">{highlightWords(exampleTranslation)}</div>}
      </div>
      <div className="word-card-buttons">
        <button className="word-card-button strange-button" onClick={() => handleAction('strange')}>陌生</button>
        <button className="word-card-button difficult-button" onClick={() => handleAction('difficult')}>困难</button>
        <button className="word-card-button good-button" onClick={() => handleAction('good')}>良好</button>
        <button className="word-card-button easy-button" onClick={() => handleAction('easy')}>容易</button>
        <button className="word-card-button master-button" onClick={() => handleAction('master')}>掌握</button>
      </div>
    </div>
  );
};

export default ContentWordCard;
