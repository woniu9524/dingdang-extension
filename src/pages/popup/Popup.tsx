import React, { useEffect, useState } from 'react';
import '@pages/popup/Popup.css';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import PopupLayout from '@pages/popup/layout/PopupLayout';
import BottomNav from '@src/shared/components/BottomNav/BottomNav';
import TopNavbar from '@src/shared/components/TopNavbar/TopNavbar';
import SettingsPage from '@src/shared/views/settings/SettingsPage';
import LoginPage from '@src/shared/views/login/LoginPage';
import WordBookList from '@src/shared/views/wordbooklist/WordBookList';
import { settingsManager } from '@src/shared/storages/SettingsManager';
import AppInfoPage from '@src/shared/views/info/AppInfoPage';

const Popup = () => {
  // 定义头部和底部内容
  const headerContent = <TopNavbar />;

  const [currentPage, setCurrentPage] = useState(null);

  const footerContent = <BottomNav onNavItemClick={setCurrentPage} currentPage={currentPage} />;

  useEffect(() => {
    settingsManager.loadSettings().then(settings => {
      if (!settings.token) {
        setCurrentPage('login');
      } else {
        setCurrentPage('settings');
      }
    });
  }, []);

  const handleLoginSuccess = () => {
    setCurrentPage('settings');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'settings':
        return <SettingsPage />;
      case 'stats':
        return <div>这里显示统计内容</div>;
      case 'history':
        return <div>这里显示历史记录</div>;
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case 'info':
        return <AppInfoPage/>;
      case 'wordbook':
        return <WordBookList />;
      default:
        return <SettingsPage />;
    }
  };

  return (
    <PopupLayout headerContent={headerContent} footerContent={footerContent}>
      {renderPage()}
    </PopupLayout>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div>Loading ...</div>), <div>Error Occur</div>);
