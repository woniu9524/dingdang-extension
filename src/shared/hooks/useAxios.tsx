import { useContext } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { useNavigate } from 'react-router-dom';
import { settingsManager } from '@src/shared/storages/SettingsManager';
import { API_BASE_URL } from '@src/shared/constants';

export interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

const useAxios = () => {
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 例如：设置请求超时时间
  });

  axiosInstance.interceptors.request.use(async config => {
    const settings = await settingsManager.loadSettings();
    config.headers['Authorization'] = `Bearer ${settings.token || ''}`;
    return config;
  });

  axiosInstance.interceptors.response.use(
    response => {
      return response.data;
    },
    error => {
      debugger;
      if (error.response.status === 401) {
        settingsManager.updateSettings({ token: '' });
        navigate('/login');
        console.error('登录已过期，请重新登录');
      }
      console.error(error.message || '网络请求异常，请稍后重试！');
      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

export default useAxios;
