import React from 'react';
import { Row, Col } from 'antd';
import './TopNavBar.css';
import Tabs from '@src/shared/components/Tabs/Tabs';

const TopNavBar = () => {
  return (
    <div style={{ marginLeft: '5px', marginRight: '5px' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <div className="logo" />
          <h1 className="title">DingDuang</h1>
        </Col>
        <Col>
          <Tabs />
        </Col>
      </Row>
    </div>
  );
};

export default TopNavBar;
