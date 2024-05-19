import React, { useState } from 'react';
import wordsStorage, { ExtensionWord } from '@src/shared/storages/WordsStorage';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Collapse } from 'antd';
import { findWordInHtml } from '@pages/content/injected/annotate/textProcessUtils';
import useExtensionApi from '@src/shared/hooks/useExtensionApi';

const { Panel } = Collapse;

interface PageListProps {
  wordList: ExtensionWord[];
}

const PageList: React.FC<PageListProps> = ({ wordList: initialWordList }) => {
  const [wordList, setWordList] = useState<ExtensionWord[]>(initialWordList);
  const { rateWord } = useExtensionApi();

  const handleAction = (type: string, index: number) => {
    if (type === 'search') {
      findWordInHtml(wordList[index].word);
    } else {
      rateWord(wordList[index].word, getRateValue(type)).then(() => {
        const updatedWordList = [...wordList];
        updatedWordList.splice(index, 1);
        setWordList(updatedWordList);
      });
      if (getRateValue(type)==5){
        wordsStorage.addStopWord(wordList[index].word)
      }
    }
  };

  const getRateValue = (type: string) => {
    switch (type) {
      case 'master':
        return 5;
      case 'delete':
        return 5;
      case 'strange':
        return 1;
      case 'difficult':
        return 2;
      case 'good':
        return 3;
      case 'easy':
        return 4;
      default:
        return 0;
    }
  };

  const highlightWords = (text: string): JSX.Element => {
    const parts = text.split(/【|】/).map((part, index) =>
      index % 2 === 1 ? <span key={index} style={{ color: 'blue', fontWeight: 'bold' }}>{part}</span> : part
    );
    return <>{parts}</>;
  };

  return (
    <Collapse accordion>
      {wordList.map((item, index) => (
        <Panel
          key={index}
          showArrow={false} // 去掉展开图标
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                type="text"
                icon={<SearchOutlined />}
                onClick={(e) => { e.stopPropagation(); handleAction('search', index); }}
                aria-label="Search"
              />
              <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                {item.word}{item.phonetic ? ` (${item.phonetic})` : ''}
              </span>
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={(e) => { e.stopPropagation(); handleAction('delete', index); }}
                aria-label="Delete"
              />
            </div>
          }
        >
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}> {/* 添加透明度 */}
            <p>{item.translation}</p>
            <p><i>{highlightWords(item.sentence)}</i> - {highlightWords(item.sentenceTranslation)}</p>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
              <button className="word-card-button strange-button" onClick={() => handleAction('strange', index)}>陌生</button>
              <button className="word-card-button difficult-button" onClick={() => handleAction('difficult', index)}>困难
              </button>
              <button className="word-card-button good-button" onClick={() => handleAction('good', index)}>良好</button>
              <button className="word-card-button easy-button" onClick={() => handleAction('easy', index)}>容易</button>
              <button className="word-card-button master-button" onClick={() => handleAction('master', index)}>掌握</button>
            </div>
          </div>
        </Panel>
      ))}
    </Collapse>
  );
};

export default PageList;
