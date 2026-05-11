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

export const registerUser = async (username, password) => {
    // We use the raw axios here, not apiClient.
    const response = await axios.post(`${API_URL}/auth/register`, { username, password });
    return response.data; 
};

// --- POSTS ---
export const getPosts = async (page = 0, size = 10, category = '', tag = '', keyword = '') => {
    // Build the query string dynamically
    let query = `?page=${page}&size=${size}`;
    if (category) query += `&category=${encodeURIComponent(category)}`;
    if (tag) query += `&tag=${encodeURIComponent(tag)}`;
    if (keyword) query += `&keyword=${encodeURIComponent(keyword)}`;

    // We use apiClient so we don't have to worry about the base URL!
    const response = await apiClient.get(`/posts${query}`);
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

export const updatePost = async (id, postData) => {
    const response = await apiClient.put(`/posts/${id}`, postData);
    return response.data;
};

export const deletePost = async (id) => {
    const response = await apiClient.delete(`/posts/${id}`);
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

// --- PRESENCE / LIVE COUNTS ---
export const getGlobalLiveCounts = async () => {
    const response = await axios.get(`${API_URL}/presence/posts`);
    return response.data;
};

export const getPostLiveCount = async (postId) => {
    const response = await axios.get(`${API_URL}/presence/posts/${postId}`);
    return response.data;
};