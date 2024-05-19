import React, { useEffect, useState } from 'react';
import {
  SettingOutlined,
  BookOutlined,
  HistoryOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
  InfoCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Drawer, Space } from 'antd';
import { ExtensionWord } from '@src/shared/storages/WordsStorage';
import PageList from '@src/shared/components/PageList/PageList';
import SideBarSettings from '@src/shared/views/sidebar/settings/SideBarSettings';
import WordBookList from '@src/shared/views/wordbooklist/WordBookList';
import { settingsManager } from '@src/shared/storages/SettingsManager';
import LoginPage from '@src/shared/views/login/LoginPage';
import Tabs from '@src/shared/components/Tabs/Tabs';

type RightSideDrawerProps = {
  visible: boolean;
  wordList?: ExtensionWord[];
  onClose: () => void;
  menu: string;
};

const RightSideDrawer: React.FC<RightSideDrawerProps> = ({ visible, wordList, onClose, menu = 'list' }) => {
  const [activeMenu, setActiveMenu] = useState(menu);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    settingsManager.loadSettings().then(settings => {
      setToken(settings.token);
    });
  }, []);

  const handleLoginSuccess = () => {
    settingsManager.loadSettings().then(settings => {
      setToken(settings.token);
    });
    setActiveMenu('settings');
  };

  const renderContent = () => {
    if (!token) {
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    switch (activeMenu) {
      case 'settings':
        return <SideBarSettings />;
      case 'wordbook':
        return <div style={{ padding: '10px' }}><WordBookList /></div>;
      case 'history':
        return <div>History Content</div>;
      case 'statistics':
        return <div>Statistics Content</div>;
      case 'list':
        return <PageList wordList={wordList} />;
      case 'info':
        return <div>Info Content</div>;
      default:
        return <div>Select a category</div>;
    }
  };

  return (
    <Drawer
      className={'processed-dingdang-never'}
      title="DingDuang"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={420}
      closeIcon={<CloseOutlined />}
      mask={false}
      bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
      drawerStyle={{
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px 0 0 16px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      headerStyle={{
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      extra={
        <Space><Tabs></Tabs></Space>
      }
    >
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {renderContent()}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.3)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          bottom: 0,
        }}
      >
        <div
          style={{ textAlign: 'center', flex: 1, cursor: 'pointer', padding: '10px 0' }}
          onClick={() => setActiveMenu('settings')}
        >
          <SettingOutlined style={{ fontSize: '24px' }} />
          <div>设 置</div>
        </div>
        <div
          style={{ textAlign: 'center', flex: 1, cursor: 'pointer', padding: '10px 0' }}
          onClick={() => setActiveMenu('wordbook')}
        >
          <BookOutlined style={{ fontSize: '24px' }} />
          <div>词 书</div>
        </div>
        <div
          style={{ textAlign: 'center', flex: 1, cursor: 'pointer', padding: '10px 0' }}
          onClick={() => setActiveMenu('history')}
        >
          <HistoryOutlined style={{ fontSize: '24px' }} />
          <div>历 史</div>
        </div>
        <div
          style={{ textAlign: 'center', flex: 1, cursor: 'pointer', padding: '10px 0' }}
          onClick={() => setActiveMenu('statistics')}
        >
          <BarChartOutlined style={{ fontSize: '24px' }} />
          <div>统 计</div>
        </div>
        <div
          style={{ textAlign: 'center', flex: 1, cursor: 'pointer', padding: '10px 0' }}
          onClick={() => setActiveMenu('list')}
        >
          <UnorderedListOutlined style={{ fontSize: '24px' }} />
          <div>清 单</div>
        </div>
        <div
          style={{ textAlign: 'center', flex: 1, cursor: 'pointer', padding: '10px 0' }}
          onClick={() => setActiveMenu('info')}
        >
          <InfoCircleOutlined style={{ fontSize: '24px' }} />
          <div>说 明</div>
        </div>
      </div>
    </Drawer>
  );
};

export default RightSideDrawer;
