import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { Appointment } from '../types/appointment';

const appointmentService = {
    getAll: async (token: string): Promise<Appointment[]> => {
        const response = await axios.get(API_ENDPOINTS.APPOINTMENTS.BASE, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.results || response.data;
    },

    getById: async (id: string, token: string): Promise<Appointment> => {
        const response = await axios.get(`${API_ENDPOINTS.APPOINTMENTS.BASE}${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    create: async (data: Partial<Appointment>, token: string): Promise<Appointment> => {
        const response = await axios.post(API_ENDPOINTS.APPOINTMENTS.BASE, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    update: async (id: string, data: Partial<Appointment>, token: string): Promise<Appointment> => {
        const response = await axios.put(`${API_ENDPOINTS.APPOINTMENTS.BASE}${id}/`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    delete: async (id: string, token: string): Promise<void> => {
        await axios.delete(`${API_ENDPOINTS.APPOINTMENTS.BASE}${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default appointmentService; 