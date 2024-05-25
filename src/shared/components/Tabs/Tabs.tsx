import React, { useEffect, useState } from 'react';
import { settingsManager, UserSettings } from '@src/shared/storages/SettingsManager';

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('popupMode');
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const handleTabClick = (tabId: string): void => {
    setActiveTab(tabId);
    const updateData: Partial<UserSettings> = {
      openMode: tabId,
    };
    settingsManager.updateSettings(updateData);
  };

  useEffect(() => {
    settingsManager.loadSettings().then((settings) => {
      setActiveTab(settings.openMode);
    });
  }, []);

  const tabContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(255, 244, 229, 0.6)',
    borderRadius: '15px',
    margin: '10px 0',
  };

  const buttonStyle = {
    backgroundColor: 'inherit',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    padding: '10px 15px',
    transition: '0.3s',
    borderRadius: '15px',
    color: '#555',
    margin: '5px 5px',
  };

  const activeButtonStyle = {
    backgroundColor: '#ffb733',
  };

  const hoverButtonStyle = {
    backgroundColor: '#ffcc66',
  };

  return (
    <div style={tabContainerStyle}>
      <button
        style={{
          ...buttonStyle,
          ...(activeTab === 'popupMode' ? activeButtonStyle : {}),
          ...(hoveredButton === 'popupMode' ? hoverButtonStyle : {})
        }}
        onClick={() => handleTabClick('popupMode')}
        onMouseEnter={() => setHoveredButton('popupMode')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <span className={'processed-dingdang-never'}>弹窗模式</span>
      </button>
      <button
        style={{
          ...buttonStyle,
          ...(activeTab === 'sidebarMode' ? activeButtonStyle : {}),
          ...(hoveredButton === 'sidebarMode' ? hoverButtonStyle : {})
        }}
        onClick={() => handleTabClick('sidebarMode')}
        onMouseEnter={() => setHoveredButton('sidebarMode')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <span className={'processed-dingdang-never'}>侧边栏模式</span>
      </button>
    </div>
  );
};

export default Tabs;
