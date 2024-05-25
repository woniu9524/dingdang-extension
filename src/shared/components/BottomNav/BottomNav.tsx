import React from 'react';
import {
  SettingOutlined,
  BarChartOutlined,
  HistoryOutlined,
  BookOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import './BottomNav.css';

const BottomNav = ({ onNavItemClick, currentPage }) => {
  const navItems = [
    { key: 'settings', icon: <SettingOutlined />, text: '设置' },
    // { key: 'stats', icon: <BarChartOutlined />, text: '统计' },
    /*{ key: 'history', icon: <HistoryOutlined />, text: '历史' },*/
    { key: 'wordbook', icon: <BookOutlined />, text: '词书' },
    { key: 'info', icon: <BulbOutlined />, text: '说明' },
  ];

  return (
    <div className="bottom-nav">
      {navItems.map(item => (
        <div
          onClick={() => onNavItemClick(item.key)}
          className={`nav-item ${currentPage === item.key ? 'active' : ''}`}
          key={item.key}
        >
          {item.icon}
          <div className="nav-text">{item.text}</div>
        </div>
      ))}
    </div>
  );
};

export default BottomNav;
