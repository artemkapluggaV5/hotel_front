import axios from 'axios';

// Создаем "прокачанного" официанта
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

// Говорим ему: "Перед каждым запросом проверяй сейф. Если там есть токен - покажи его!"
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // Формат DRF требует слово "Token " перед самим ключом
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;