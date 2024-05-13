import React, { useEffect, useState } from 'react';
import { List } from 'antd';
import WordBookCard from '../../components/WordBookCard/WordBookCard';
import useExtensionApi from '@src/shared/hooks/useExtensionApi';
import wordsStorage, { Words } from '@src/shared/storages/WordsStorage';
import { settingsManager, UserSettings } from '@src/shared/storages/SettingsManager';
import { cleanTranslation } from '@src/shared/utils/ChromExtendTool';

export interface WordBook {
  bookNo: number;
  title: string;
  wordCount: number;
  masteredCount: number;
  active: boolean;
  bookSeq: number;
  language: string;
}

const WordBookList: React.FC = () => {
  const [books, setBooks] = useState<WordBook[]>([]);
  const { getWordBooks, usWordBook, stopUseWordBook, getWordList } = useExtensionApi();

  const refreshBooks = () => {
    getWordBooks().then(res => {
      const sortedBooks = res.data.sort((a, b) => a.bookSeq - b.bookSeq);
      setBooks(sortedBooks);
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
    refreshBooks();
  }, []);

  const handleCardClick = (bookNo: number, active: boolean) => {
    if (!active) {
      usWordBook(bookNo).then(() => {
        refreshBooks();
      });

    } else {
      stopUseWordBook(bookNo).then(() => {
        refreshBooks();
      });
    }
  };

  return (
    <List
      dataSource={books}
      renderItem={item => (
        <List.Item>
          <WordBookCard
            bookNo={item.bookNo}
            bookName={item.title}
            masteredCount={item.masteredCount}
            totalCount={item.wordCount}
            isActive={item.active}
            toggleActive={() => {
              handleCardClick(item.bookNo, item.active);
            }}
          />
        </List.Item>
      )}
    />
  );
};

export default WordBookList;
