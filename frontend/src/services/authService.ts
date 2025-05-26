import axios from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

const PATIENT_API_URL = process.env.REACT_APP_PATIENT_API_URL || 'http://localhost:8004';
const DOCTOR_API_URL = process.env.REACT_APP_DOCTOR_API_URL || 'http://localhost:8003';

export const authService = {
    login: async (data: LoginRequest & { role?: 'patient' | 'doctor' }): Promise<AuthResponse> => {
        const baseUrl = data.role === 'doctor' ? DOCTOR_API_URL : PATIENT_API_URL;
        const endpoint = data.role === 'doctor' ? '/api/doctors/login/' : '/api/patients/login/';
        const response = await axios.post(`${baseUrl}${endpoint}`, data);
        if (response.data.access) {
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
        }
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const baseUrl = data.role === 'doctor' ? DOCTOR_API_URL : PATIENT_API_URL;
        const endpoint = data.role === 'doctor' ? '/api/doctors/register/' : '/api/patients/register/';
        const response = await axios.post(`${baseUrl}${endpoint}`, data);
        if (response.data.access) {
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
    },

    getCurrentUser: async (): Promise<AuthResponse> => {
        const response = await axios.get(`${PATIENT_API_URL}/api/profile/`);
        return response.data;
    },

    refreshToken: async (): Promise<AuthResponse> => {
        const response = await axios.post(`${PATIENT_API_URL}/api/token/refresh/`, {
            refresh: localStorage.getItem('refresh')
        });
        if (response.data.access) {
            localStorage.setItem('access', response.data.access);
        }
        return response.data;
    }
}; 