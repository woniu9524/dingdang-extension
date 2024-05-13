import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  SettingOutlined,
  BarChartOutlined,
  HistoryOutlined,
  UnorderedListOutlined,
  BookOutlined,
  BellOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import './BottomNav.css';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { key: 'settings', icon: <SettingOutlined />, text: '设置', to: '/' },
    { key: 'stats', icon: <BarChartOutlined />, text: '统计', to: '/stats' },
    { key: 'history', icon: <HistoryOutlined />, text: '历史', to: '/history' },
    /* { key: 'todo', icon: <UnorderedListOutlined />, text: '清单', to: '/todo' },*/
    { key: 'wordbook', icon: <BookOutlined />, text: '词书', to: '/wordbook' },
    { key: 'info', icon: <BulbOutlined />, text: '说明', to: '/information' },
  ];

  return (
    <div className="bottom-nav">
      {navItems.map(item => (
        <Link to={item.to} className={`nav-item ${location.pathname === item.to ? 'active' : ''}`} key={item.key}>
          {item.icon}
          <div className="nav-text">{item.text}</div>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
