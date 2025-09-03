import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    config => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (usuario) {
            config.headers.Authorization = `Bearer ${usuario.token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);
// response interceptor for debugging 401/403
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401 || status === 403) {
                console.warn('API returned', status, error.response.data);
            }
        }
        return Promise.reject(error);
    }
);
export default api;