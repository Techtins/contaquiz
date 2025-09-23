import 'dotenv/config';
import axios, { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL);

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    return config;
});

export default api;