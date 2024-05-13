import React from 'react';
import { Row, Col } from 'antd';
import './TopNavBar.css';
import Tabs from '@src/shared/components/Tabs/Tabs';

const TopNavBar = () => {
  const handleTabChange = (activeTab: string) => {
    console.log('当前激活的标签是:', activeTab);
    // 这里你可以根据activeTab的值进行更多逻辑处理
  };

  return (
    <div style={{ marginLeft: '5px', marginRight: '5px' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <div className="logo" />
          <h1 className="title">DingDuang</h1>
        </Col>
        <Col>
          <Tabs onTabChange={handleTabChange} />
        </Col>
      </Row>
    </div>
  );
};

export default TopNavBar;
