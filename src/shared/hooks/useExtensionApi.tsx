// useExtensionApi.js
import useAxios, { ResponseData } from './useAxios'; // 确保这个路径与你的 useAxios 钩子的实际路径匹配

const useExtensionApi = () => {
  const axios = useAxios();

  const getWordBooks = (): Promise<ResponseData> => {
    try {
      return axios.get('v1/wordbook/list');
    } catch (error) {
      console.error('获取单词书列表失败:', error);
      throw error; // 或者处理错误
    }
  };

  const getScanResult = (sceneId: string): Promise<ResponseData> => {
    try {
      return axios.get(`v1/auth/isLogin/${sceneId}`);
    } catch (error) {
      console.error('获取扫码结果失败:', error);
      throw error; // 或者处理错误
    }
  };

  const usWordBook = (bookNo: number): Promise<ResponseData> => {
    try {
      return axios.get(`v1/wordbook/use?bookNo=${bookNo}`);
    } catch (error) {
      console.error('使用单词书失败:', error);
      throw error; // 或者处理错误
    }
  };

  // 停用单词书
  const stopUseWordBook = (bookNo: number): Promise<ResponseData> => {
    try {
      return axios.get(`v1/wordbook/stopUse?bookNo=${bookNo}`);
    } catch (error) {
      console.error('停用单词书失败:', error);
      throw error; // 或者处理错误
    }
  };

  // 读取单词书中的单词
  const getWordList = (): Promise<ResponseData> => {
    try {
      return axios.get(`v1/wordbook/wordList`);
    } catch (error) {
      console.error('获取单词列表失败:', error);
      throw error; // 或者处理错误
    }
  };

  return {
    getWordBooks,
    getScanResult,
    usWordBook,
    stopUseWordBook,
    getWordList,
  };
};

export default useExtensionApi;
