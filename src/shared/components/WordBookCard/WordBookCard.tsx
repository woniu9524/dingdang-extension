import React from 'react';
import { Card, Button } from 'antd';

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
        overflow: 'hidden',
      }}
      bodyStyle={{ padding: '0', display: 'flex', flexGrow: 1 }}
    >
      <div
        style={{ flex: 1, padding: '10px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ margin: '5px 5px 0px 5px' }}>{bookName}</h2>
        <p style={{ margin: '5px' }}>
          掌握单词数量：{masteredCount}/{totalCount}
        </p>
      </div>
      <Button
        onClick={toggleActive}
        style={{
          height: '100%',
          fontSize: '16px',
          color: '#FFE58F',
          backgroundColor: isActive ? '#749F82' : '#8c8c8c',
          transition: 'background-color 0.3s',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '20%',
          border: 'none',
          borderRadius: 0,
          margin: 0,
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a6a6a6'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isActive ? '#749F82' : '#8c8c8c'}
      >
        {isActive ? '停用' : '使用'}
      </Button>
    </Card>
  );
};

export default WordBookCard;
