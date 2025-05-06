import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5258',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Security prevent user
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


// Security prevent user
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);
export default instance;