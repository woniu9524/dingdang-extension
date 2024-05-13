import React, { useState } from 'react';
import { Drawer, Menu } from 'antd';
import {
  SettingOutlined,
  BookOutlined,
  HistoryOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { ExtensionWord } from '@src/shared/storages/WordsStorage';
import PageList from '@src/shared/components/PageList/PageList';

type RightSideDrawerProps = {
  visible: boolean;
  wordList?: ExtensionWord[];
  onClose: () => void;
};

const RightSideDrawer: React.FC<RightSideDrawerProps> = ({ visible, wordList, onClose }) => {
  const [activeMenu, setActiveMenu] = useState('list');

  const renderContent = () => {
    switch (activeMenu) {
      case 'settings':
        return <div>Settings Content</div>;
      case 'wordbook':
        return <div>Word Book Content</div>;
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
      placement="right"
      closable={true}
      onClose={onClose}
      visible={visible}
      width={400}
      bodyStyle={{ padding: 0, borderRadius: '8px 0 0 8px' }}
      mask={false}
      style={{ overflow: 'hidden' }} // 解决圆角问题
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {renderContent()}
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[activeMenu]}
          onClick={({ key }) => setActiveMenu(key)}
          style={{ textAlign: 'center', borderTop: '1px solid #f0f0f0' }}
        >
          <Menu.Item key="settings" icon={<SettingOutlined style={{ fontSize: '24px' }} />} title="设置" />
          <Menu.Item key="wordbook" icon={<BookOutlined style={{ fontSize: '24px' }} />} title="词书" />
          <Menu.Item key="history" icon={<HistoryOutlined style={{ fontSize: '24px' }} />} title="历史" />
          <Menu.Item key="statistics" icon={<BarChartOutlined style={{ fontSize: '24px' }} />} title="统计" />
          <Menu.Item key="list" icon={<UnorderedListOutlined style={{ fontSize: '24px' }} />} title="清单" />
          <Menu.Item key="info" icon={<InfoCircleOutlined style={{ fontSize: '24px' }} />} title="说明" />
        </Menu>
      </div>
    </Drawer>
  );
};

export default RightSideDrawer;
