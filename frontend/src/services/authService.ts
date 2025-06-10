import axios from 'axios';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';

const API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://localhost:8000/api/users';

export const authService = {
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/register/`, data);
        return response.data;
    },

    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/login/`, data);
        return response.data;
    },

    async getProfile(): Promise<any> {
        const response = await axios.get(`${API_URL}/profile/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        return response.data;
    },

    async refreshToken(): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: localStorage.getItem('refresh_token')
        });
        return response.data;
    },

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
}; 