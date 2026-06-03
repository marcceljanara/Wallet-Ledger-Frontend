import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  withCredentials: true, // Crucial for cookie-based JWT authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
