import React, { useState } from 'react';
import './Tabs.css';

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('popupMode');

  const handleTabClick = (tabId: string): void => {
    setActiveTab(tabId);
  };

  return (
    <div className="tab-container">
      <button
        className={`tab-button ${activeTab === 'popupMode' ? 'active' : ''}`}
        onClick={() => handleTabClick('popupMode')}>
        弹窗模式
      </button>
      <button
        className={`tab-button ${activeTab === 'sidebarMode' ? 'active' : ''}`}
        onClick={() => handleTabClick('sidebarMode')}>
        侧边栏模式
      </button>
    </div>
  );
};

export default Tabs;
