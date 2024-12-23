import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
// import { executeRecaptcha } from './recaptcha';

const request = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
request.interceptors.request.use(
    async (config) => {
        // 获取 JWT token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // try {
        //     // 获取 ReCaptcha token
        //     const recaptchaToken = await executeRecaptcha(config.url || 'default_action');
        //     config.headers['X-Recaptcha-Token'] = recaptchaToken;
        // } catch (error) {
        //     console.error('Failed to get ReCaptcha token:', error);
        // }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default request as {
    get<T>(url: string, config?: any): Promise<T>;
    post<T>(url: string, data?: any, config?: any): Promise<T>;
    put<T>(url: string, data?: any, config?: any): Promise<T>;
    delete<T>(url: string, config?: any): Promise<T>;
}; 