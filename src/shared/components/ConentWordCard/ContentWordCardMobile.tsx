import React, { useEffect, useRef } from 'react';
import { CloseOutlined, SoundOutlined } from '@ant-design/icons';

interface ContentWordCardMobileProps {
  word: string;
  translation: string;
  example?: string;
  exampleTranslation?: string;
  onClose: () => void;
}

const ContentWordCardMobile: React.FC<ContentWordCardMobileProps> = ({ word, translation, example, exampleTranslation, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePronunciation = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    } else {
      console.log('此浏览器不支持speechSynthesis API。');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleAction = (action: string) => {
    console.log(`用户对单词${word}执行了${action}操作`);
  };

  const highlightWords = (text: string): JSX.Element => {
    const parts = text.split(/【|】/).map((part, index) =>
      index % 2 === 1 ? <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span> : part
    );
    return <>{parts}</>;
  };

  return (
    <div ref={cardRef} style={{
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      width: '90%',
      maxWidth: '400px',
      margin: 'auto',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '16px',
      lineHeight: '24px',
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>单词详情</div>
        <button onClick={onClose} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}><CloseOutlined /></button>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '8px' }}>{word}</span>
          <span onClick={handlePronunciation} style={{
            cursor: 'pointer',
            color: '#1890ff',
            fontSize: '20px'
          }}><SoundOutlined /></span>
        </div>
        <div style={{ marginBottom: '12px', color: '#555' }}>{translation}</div>
        {example && <div style={{ marginBottom: '8px', color: '#555' }}>{highlightWords(example)}</div>}
        {exampleTranslation && <div style={{ marginBottom: '12px', color: '#888' }}>{highlightWords(exampleTranslation)}</div>}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        <button onClick={() => handleAction('strange')} style={buttonStyle}>陌生</button>
        <button onClick={() => handleAction('difficult')} style={buttonStyle}>困难</button>
        <button onClick={() => handleAction('good')} style={buttonStyle}>良好</button>
        <button onClick={() => handleAction('easy')} style={buttonStyle}>容易</button>
        <button onClick={() => handleAction('master')} style={buttonStyle}>掌握</button>
      </div>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#fff',
  backgroundColor: '#1890ff',
  margin: '4px'
};

export default ContentWordCardMobile;
