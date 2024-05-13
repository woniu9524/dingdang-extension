import React, { useEffect, useState } from 'react';
import '@pages/popup/Popup.css';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import PopupLayout from '@pages/popup/layout/PopupLayout';
import BottomNav from '@src/shared/components/BottomNav/BottomNav';
import TopNavbar from '@src/shared/components/TopNavbar/TopNavbar';
import SettingsPage from '@src/shared/views/settings/SettingsPage';
import LoginPage from '@src/shared/views/login/LoginPage';
import { API_BASE_URL } from '@src/shared/constants';
import WordBookCard from '@src/shared/components/WordBookCard/WordBookCard';
import WordBookList from '@src/shared/views/wordbooklist/WordBookList';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { settingsManager } from '@src/shared/storages/SettingsManager';

const Popup = () => {
  // 定义头部和底部内容
  const headerContent = <TopNavbar />;
  const footerContent = <BottomNav />;

  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialRedirectDone, setInitialRedirectDone] = useState(false);

  useEffect(() => {
    if (!isInitialRedirectDone) {
      settingsManager.loadSettings().then(settings => {
        if (!settings.token && location.pathname !== '/login') {
          navigate('/login');
        } else if (settings.token && location.pathname !== '/') {
          navigate('/');
        }
        setInitialRedirectDone(true);
      });
    }
  }, [navigate, location.pathname, isInitialRedirectDone]);

  return (
    <PopupLayout headerContent={headerContent} footerContent={footerContent}>
      <Routes>
        <Route path="/" element={<SettingsPage />} />
        <Route path="/stats" element={<div>这里显示统计内容</div>} />
        <Route path="/history" element={<div>这里显示历史记录</div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/todo" element={<LoginPage />} />
        <Route path="/wordbook" element={<WordBookList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PopupLayout>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div>Loading ...</div>), <div>Error Occur</div>);
