import React from 'react';
import { Layout } from 'antd';
import './PopupLayout.css';

const { Header, Footer, Content } = Layout;

interface PopupLayoutProps {
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  children?: React.ReactNode;
}

const PopupLayout: React.FC<PopupLayoutProps> = ({ headerContent, footerContent, children }) => {
  return (
    <Layout className="popup-layout">
      <Header className="popup-header">{headerContent || 'Header'}</Header>
      <Content className="popup-content">{children}</Content>
      <Footer className="popup-footer">{footerContent || 'Footer'}</Footer>
    </Layout>
  );
};

export default PopupLayout;
