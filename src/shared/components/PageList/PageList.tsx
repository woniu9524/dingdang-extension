import React, { useState } from 'react';
import { ExtensionWord } from '@src/shared/storages/WordsStorage';
import { List, Button, Collapse, Space } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';

interface PageListProps {
  wordList: ExtensionWord[];
}

const PageList: React.FC<PageListProps> = ({ wordList }) => {
  const [expandedWord, setExpandedWord] = useState<number | null>(null);

  const handleExpandClick = (index: number) => {
    setExpandedWord(expandedWord === index ? null : index);
  };

  const handleAction = (type: string) => {
    console.log(type);
  };

  const highlightWords = (text: string): JSX.Element => {
    const parts = text.split(/【|】/).map((part, index) =>
      index % 2 === 1 ? <span key={index} className="word-highlight">{part}</span> : part
    );
    return <>{parts}</>;
  };

  const getItems = (item: ExtensionWord) => ([
    {
      key: '1',
      label: null,
      children: (
        <>
          <p>{item.translation}</p>
          <p><i>{highlightWords(item.sentence)}</i> - {highlightWords(item.sentenceTranslation)}</p>
          <Space style={{ marginTop: '10px' }}>
            <button className="word-card-button strange-button" onClick={() => handleAction('strange')}>陌生</button>
            <button className="word-card-button difficult-button" onClick={() => handleAction('difficult')}>困难</button>
            <button className="word-card-button good-button" onClick={() => handleAction('good')}>良好</button>
            <button className="word-card-button easy-button" onClick={() => handleAction('easy')}>容易</button>
            <button className="word-card-button master-button" onClick={() => handleAction('master')}>掌握</button>
          </Space>
        </>
      ),
      showArrow: false,
    },
  ]);

  return (
    <List
      itemLayout="vertical"
      dataSource={wordList}
      renderItem={(item, index) => (
        <List.Item key={index}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button type="text" icon={<SearchOutlined />} />
            <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => handleExpandClick(index)}>
              <span>{item.word}{item.phonetic ? ` (${item.phonetic})` : ''}</span>
            </div>
            <Button type="text" icon={<DeleteOutlined />} />
          </div>
          {expandedWord === index && (
            <Collapse items={getItems(item)} activeKey={expandedWord === index ? '1' : ''} ghost />
          )}
        </List.Item>
      )}
    />
  );
};

export default PageList;
