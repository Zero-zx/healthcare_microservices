import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { CreateDoctorDto, UpdateDoctorDto, Doctor } from '../types/user';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// Doctor Services
const doctorService = {
    getAll: async (token: string): Promise<Doctor[]> => {
        const response = await axios.get(API_ENDPOINTS.DOCTORS.BASE, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getById: async (id: string, token: string): Promise<Doctor> => {
        const response = await axios.get(`${API_ENDPOINTS.DOCTORS.BASE}${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    create: async (data: CreateDoctorDto, token: string): Promise<Doctor> => {
        const response = await axios.post(API_ENDPOINTS.DOCTORS.BASE, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    update: async (id: string, data: UpdateDoctorDto, token: string): Promise<Doctor> => {
        const response = await axios.put(`${API_ENDPOINTS.DOCTORS.BASE}${id}/`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    delete: async (id: string, token: string): Promise<void> => {
        await axios.delete(`${API_ENDPOINTS.DOCTORS.BASE}${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default doctorService; 