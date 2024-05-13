// BackButton.tsx
import React from 'react';

const BackButton = ({ onOpenDrawer }) => {
  return (
    <button
      onClick={onOpenDrawer}
      style={{
        position: 'fixed',
        right: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: 'none',
        cursor: 'pointer',
        width: '40px',
        height: '40px',
        borderRadius: '40px 0 0 40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0',
      }}
      aria-label="Open Drawer"
    >
      {/* SVG for arrow icon */}
      <svg width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48">
        <path
          d="M21.316 29.73a1.393 1.393 0 01-1.97 0l-5.056-5.055a1.393 1.393 0 010-1.97l.012-.011 5.044-5.045a1.393 1.393 0 011.97 1.97l-4.07 4.071 4.07 4.071a1.393 1.393 0 010 1.97z"
          fill="#fff"></path>
      </svg>
    </button>
  );
};

export default BackButton;
