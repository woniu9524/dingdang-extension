import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { API_BASE_URL } from '@src/shared/constants';
import { settingsManager, UserSettings } from '@src/shared/storages/SettingsManager';
import useExtensionApi from '@src/shared/hooks/useExtensionApi';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const generateScene = () => {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 100000);
    return `${timestamp}${randomPart}`;
  };

  // Update to use a setter for scene state
  const [scene, setScene] = useState(generateScene);
  const navigate = useNavigate();
  const qrCodeUrl = `${API_BASE_URL}/v1/auth/login/wechat?scene=${scene}`;
  const { getScanResult } = useExtensionApi();
  useEffect(() => {
    const interval = setInterval(() => {
      getScanResult(scene)
        .then(response => {
          if (response.code === 200) {
            clearInterval(interval);
            const updateData: Partial<UserSettings> = {
              token: response.data || '',
            };
            settingsManager.updateSettings(updateData);
            navigate('/');
          } else if (response.code == 400) {
            console.log('二维码已失效');
            clearInterval(interval);
          }
        })
        .catch(error => {
          console.error('查询扫描结果失败:', error);
        });
    }, 5000);

    return () => clearInterval(interval);
  }, [scene]); // Include scene in the dependency array

  // Function to refresh QR code
  const refreshQRCode = () => {
    setScene(generateScene);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '350px',
        marginTop: '50px',
      }}>
      <Card
        hoverable
        style={{
          width: 300,
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          cursor: 'default',
          height: '100%',
        }}>
        <img src={qrCodeUrl} alt="登录二维码" style={{ width: '100%', marginBottom: 20, height: '220px' }} />
        <Button icon={<ReloadOutlined />} onClick={refreshQRCode} style={{ marginBottom: 10 }}>
          刷新二维码
        </Button>
        <p>请先扫码登录🤫</p>
      </Card>
    </div>
  );
};

export default LoginPage;
