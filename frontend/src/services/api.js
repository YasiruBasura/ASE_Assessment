import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: API_URL,
});

// Intercept requests to attach the token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- AUTHENTICATION ---
export const loginUser = async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data; // Returns { token, username }
};

// --- POSTS ---
export const getPosts = async (page = 0, size = 10) => {
    const response = await apiClient.get(`/posts?page=${page}&size=${size}`);
    return response.data;
};

export const getPostById = async (id) => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
};

export const createPost = async (postData) => {
    const response = await apiClient.post('/posts', postData);
    return response.data;
};

// --- COMMENTS ---
export const getComments = async (postId, page = 0, size = 10) => {
    const response = await apiClient.get(`/posts/${postId}/comments?page=${page}&size=${size}`);
    return response.data;
};

export const createComment = async (postId, commentData) => {
    const response = await apiClient.post(`/posts/${postId}/comments`, commentData);
    return response.data;
};