import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor que busca el token y lo mete en el "Bearer token" automáticamente
api.interceptors.request.use((config) => {
    // 🔥 CORREGIDO: Buscamos 'token' que es como lo guardaremos abajo
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Agrupación de los servicios mapeados con tu documento
export const authService = {
    register: async (data) => { await api.post('/auth/register', data); },
    login: async (data) => {
        const response = await api.post('/auth/login', data);

        // 🔥 CORREGIDO: Leemos 'access_token' del backend, pero lo guardamos como 'token'
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
        }
        return response.data;
    },
    logout: () => { localStorage.removeItem('token'); }
};

export const affiliationService = {
    getAll: async () => { const response = await api.get('/affiliations'); return response.data; }
};

export const procedureService = {
    getAll: async () => { const response = await api.get('/procedures'); return response.data; }
};

export const bondService = {
    getAll: async () => { const response = await api.get('/bonds'); return response.data; }
};

export const notificationService = {
    getUnread: async () => { const response = await api.get('/notifications'); return response.data; },
    markAsRead: async (body) => { await api.post('/notifications', body); }
};

export const userService = {
    getProfile: async () => { const response = await api.get('/users'); return response.data; },
    updateProfile: async (data) => { await api.post('/users', data); }
};