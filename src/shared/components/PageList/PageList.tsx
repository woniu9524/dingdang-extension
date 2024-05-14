import React, { useState } from 'react';
import { ExtensionWord } from '@src/shared/storages/WordsStorage';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Collapse, List } from 'antd';
import { findWordInHtml } from '@pages/content/injected/annotate/textProcessUtils';

const { Panel } = Collapse;

interface PageListProps {
  wordList: ExtensionWord[];
}

const PageList: React.FC<PageListProps> = ({ wordList }) => {
  const handleAction = (type: string, index: number, wordList: ExtensionWord[]) => {
    if (type === 'search') {
      findWordInHtml(wordList[index].word);
    }
    // 添加其他操作逻辑，例如删除单词等
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
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                type="text"
                icon={<SearchOutlined />}
                onClick={(e) => { e.stopPropagation(); handleAction('search', index, wordList); }}
              />
              <span>{item.word}{item.phonetic ? ` (${item.phonetic})` : ''}</span>
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={(e) => { e.stopPropagation(); handleAction('delete', index, wordList); }}
              />
            </div>
          }
        >
          <p>{item.translation}</p>
          <p><i>{highlightWords(item.sentence)}</i> - {highlightWords(item.sentenceTranslation)}</p>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
            <Button
              style={{ backgroundColor: '#f5222d', color: '#ffffff' }}
              onClick={() => handleAction('strange', index, wordList)}
            >
              陌生
            </Button>
            <Button
              style={{ backgroundColor: '#faad14', color: '#ffffff' }}
              onClick={() => handleAction('difficult', index, wordList)}
            >
              困难
            </Button>
            <Button
              style={{ backgroundColor: '#52c41a', color: '#ffffff' }}
              onClick={() => handleAction('good', index, wordList)}
            >
              良好
            </Button>
            <Button
              style={{ backgroundColor: '#1890ff', color: '#ffffff' }}
              onClick={() => handleAction('easy', index, wordList)}
            >
              容易
            </Button>
            <Button
              style={{ backgroundColor: '#722ed1', color: '#ffffff' }}
              onClick={() => handleAction('master', index, wordList)}
            >
              掌握
            </Button>
          </div>
        </Panel>
      ))}
    </Collapse>
  );
};

export default PageList;
