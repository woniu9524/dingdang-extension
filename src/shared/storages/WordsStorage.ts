import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

export type ExtensionWord = {
  word: string;
  translation: string;
  phonetic: string;
  lazyTranslation: string;
  sentence: string;
  sentenceTranslation: string;
};

// 更新类型为使用字典结构
export type DictionaryOfStringArray = { [key: string]: string[] };
export type DictionaryOfExtensionWordArray = { [key: string]: ExtensionWord };

export type Words = {
  extensionWords: DictionaryOfExtensionWordArray; // 扩展词汇
  sourceLanguageWords: DictionaryOfStringArray; // 源语言词汇
  targetLanguageWords: DictionaryOfStringArray; // 目标语言词汇
  simpleSourceLanguageWords: DictionaryOfStringArray; // 简化源语言词汇
  simpleTargetLanguageWords: DictionaryOfStringArray; // 简化目标语言词汇
  stopWords: string[]; // 停止词
  wordList: ExtensionWord[]; // 单词列表
  bookNo: number; //书号
  language: string; //语言
};

class WordsStorage {
  private static instance: WordsStorage;
  private wordsStorage: BaseStorage<Words>;

  private constructor() {
    const defaultWords: Words = {
      extensionWords: {}, // 初始化为空对象
      sourceLanguageWords: {}, // 初始化为空对象
      targetLanguageWords: {}, // 初始化为空对象
      simpleSourceLanguageWords: {}, // 初始化为空对象
      simpleTargetLanguageWords: {}, // 初始化为空对象
      stopWords: [], // 初始化为空数组
      wordList: [], // 初始化为空数组
      bookNo: 0,
      language: 'en',
    };

    this.wordsStorage = createStorage<Words>('words-key', defaultWords, {
      storageType: StorageType.Local,
      liveUpdate: true,
    });
  }

  public static getInstance(): WordsStorage {
    if (!WordsStorage.instance) {
      WordsStorage.instance = new WordsStorage();
    }
    return WordsStorage.instance;
  }

  // 更新词汇
  public async updateWords(update: Partial<Words>): Promise<void> {
    await this.wordsStorage.set(words => ({ ...words, ...update }));
  }

  // 添加停止词
  public async addStopWord(stopWord: string): Promise<void> {
    await this.updateWords({ stopWords: [...this.wordsStorage.getSnapshot()?.stopWords, stopWord] });
  }

  // 移除所有停止词
  public async removeAllStopWord(): Promise<void> {
    await this.updateWords({ stopWords: [] });
  }

  // 读取词汇
  public async get(): Promise<Words> {
    return this.wordsStorage.get();
  }
}

const appWordsStorage = WordsStorage.getInstance();

export default appWordsStorage;
