import React, { CSSProperties } from 'react';
import { Row, Col } from 'antd';
import Tabs from '@src/shared/components/Tabs/Tabs';


const TopNavBar = () => {
  const logoStyle: CSSProperties = {
    width: '48px',
    height: '48px',
    background: 'url("/assets/png/logo.chunk.png") no-repeat center center',
    backgroundSize: 'contain',
    float: 'left' as CSSProperties['float'],
    marginRight: '5px',
  };

  const titleStyle: CSSProperties = {
    float: 'left' as CSSProperties['float'],
    lineHeight: '48px',
    margin: '0',
    fontSize: '18px',
  };

  return (
    <div style={{ marginLeft: '5px', marginRight: '5px' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <div style={logoStyle} />
          <h1 style={titleStyle}>DingDuang</h1>
        </Col>
        <Col>
          <Tabs />
        </Col>
      </Row>
    </div>
  );
};

export default TopNavBar;
