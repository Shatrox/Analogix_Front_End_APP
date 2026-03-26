import axios from 'axios';

// Allows for connection with the backend API, which is running on localhost:7249
const api = axios.create({
    baseURL: 'https://localhost:7249/api',
    headers: {
        'Content-Type': 'application/json',
    },
});



// Authentication Token Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default api;