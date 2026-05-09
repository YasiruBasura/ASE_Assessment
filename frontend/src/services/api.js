import axios from 'axios';

const API_URL = 'http://localhost:8080/api/posts';

// Fetch paginated posts
export const getPosts = async (page = 0, size = 10) => {
    try {
        const response = await axios.get(`${API_URL}?page=${page}&size=${size}`);
        return response.data; // Spring Boot returns the data here
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
};

// Create a new post
export const createPost = async (postData) => {
    try {
        const response = await axios.post(API_URL, postData);
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};
