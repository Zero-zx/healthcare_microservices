import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';

const authService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, data);
        return response.data;
    },

    refreshToken: async (refresh: string): Promise<{ access: string }> => {
        const response = await axios.post(API_ENDPOINTS.AUTH.REFRESH, { refresh });
        return response.data;
    },

    getProfile: async (token: string): Promise<any> => {
        const response = await axios.get(API_ENDPOINTS.USERS.PROFILE, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default authService; 