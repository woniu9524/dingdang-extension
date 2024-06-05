import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { API_BASE_URL } from '@src/shared/constants';
import { settingsManager, UserSettings } from '@src/shared/storages/SettingsManager';
import useExtensionApi from '@src/shared/hooks/useExtensionApi';
import wordsStorage, { Words } from '@src/shared/storages/WordsStorage';
import { cleanTranslation } from '@src/shared/utils/ChromExtendTool';



const LoginPage = ({ onLoginSuccess }) => {
  const generateScene = () => {
    const timestamp = Date.now().toString();
    const randomPart = Math.floor(Math.random() * 1000);
    // 截取 timestamp 的后 6 位
    const shortTimestamp = timestamp.slice(-6);

    return `${shortTimestamp}${randomPart}`;
  };


  // Update to use a setter for scene state
  const [scene, setScene] = useState(generateScene);
  const qrCodeUrl = `${API_BASE_URL}/v1/auth/login/wechat?scene=${scene}`;
  const { getScanResult } = useExtensionApi();

  const { getWordBooks, getWordList } = useExtensionApi();

  const refreshBooks = () => {
    getWordBooks().then(res => {
      const sortedBooks = res.data.sort((a, b) => a.bookSeq - b.bookSeq);
      // 读取使用的书号和wordsStorage中的书号进行比较，如果不一致则更新单词列表
      wordsStorage.get().then(words => {
        if (words.bookNo !== sortedBooks[0].bookNo && sortedBooks[0].active) {
          getWordList().then(res => {
            const extensionWordsArr = res.data;
            const bookNo = sortedBooks[0].bookNo;
            const targetLanguage = sortedBooks[0].language;
            // 清洗数据，存储单词数据
            wordsStorage.removeAllStopWord();
            const updatedSourceLanguageWords = {};
            const updatedTargetLanguageWords = {};
            const updatedSimpleSourceLanguageWords = {};
            const updatedSimpleTargetLanguageWords = {};
            const extensionWords = {};
            for (const extensionWord of extensionWordsArr) {
              const word = extensionWord.word;
              const translation = extensionWord.translation;
              const lazyTranslation = extensionWord.lazyTranslation;
              const sourceList = cleanTranslation(translation);
              const simpleSourceList = cleanTranslation(lazyTranslation);
              extensionWords[word] = extensionWord;
              updatedTargetLanguageWords[word] = sourceList;
              updatedSimpleTargetLanguageWords[word] = simpleSourceList;
              for (const source of sourceList) {
                if (!updatedSourceLanguageWords[source]) {
                  updatedSourceLanguageWords[source] = [];
                }
                updatedSourceLanguageWords[source].push(word);
              }
              for (const simpleSource of simpleSourceList) {
                if (!updatedSimpleSourceLanguageWords[simpleSource]) {
                  updatedSimpleSourceLanguageWords[simpleSource] = [];
                }
                updatedSimpleSourceLanguageWords[simpleSource].push(word);
              }
            }
            const updatedData: Partial<Words> = {
              extensionWords: extensionWords,
              bookNo: bookNo,
              sourceLanguageWords: updatedSourceLanguageWords,
              targetLanguageWords: updatedTargetLanguageWords,
              simpleSourceLanguageWords: updatedSimpleSourceLanguageWords,
              simpleTargetLanguageWords: updatedSimpleTargetLanguageWords,
            };
            const updatedSettingsData: Partial<UserSettings> = {
              targetLanguage: targetLanguage,
            };
            wordsStorage.updateWords(updatedData);
            settingsManager.updateSettings(updatedSettingsData);
          });
        }
      });
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getScanResult(scene)
        .then(response => {
          if (response.code === 200) {
            clearInterval(interval);
            const updateData: Partial<UserSettings> = {
              token: response.data || '',
            };
            console.log('更新token成功',updateData);
            settingsManager.updateSettings(updateData).then(()=>{
              refreshBooks();
              onLoginSuccess();
            })

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
