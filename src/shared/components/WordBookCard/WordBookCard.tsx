import React from 'react';
import { Card, Button } from 'antd';
import './WordBookCard.css';

interface WordBookCardProps {
  bookNo: number;
  bookName: string;
  masteredCount: number;
  totalCount: number;
  isActive: boolean;
  toggleActive: () => void;
}

const WordBookCard: React.FC<WordBookCardProps> = ({
  bookNo,
  bookName,
  masteredCount,
  totalCount,
  isActive,
  toggleActive,
}) => {
  return (
    <Card
      style={{
        width: '100%',
        borderRadius: '15px',
        backgroundColor: isActive ? '#B0CA57' : '#B2AB99',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        height: '80px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        overflow: 'hidden', // 保证所有内容都在圆角内部
      }}
      bodyStyle={{ padding: '0', display: 'flex', flexGrow: 1 }} // 移除padding，确保内容填满
    >
      <div
        style={{ flex: 1, padding: '10px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ margin: '5px 5px 0px 5px' }}>{bookName}</h2>
        <p style={{ margin: '5px' }}>
          掌握单词数量：{masteredCount}/{totalCount}
        </p>
      </div>
      <Button
        className={isActive ? 'custom-button active' : 'custom-button'}
        onClick={toggleActive}
        style={{
          width: '20%',
          border: 'none',
          borderRadius: 0,
          margin: 0,
        }}>
        {isActive ? '停用' : '使用'}
      </Button>
    </Card>
  );
};

export default WordBookCard;
