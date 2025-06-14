import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { CreatePatientDto, UpdatePatientDto, Patient } from '../types/user';

const patientService = {
    getAll: async (token: string): Promise<Patient[]> => {
        const response = await axios.get(API_ENDPOINTS.PATIENTS.BASE, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getById: async (id: string, token: string): Promise<Patient> => {
        const response = await axios.get(`${API_ENDPOINTS.PATIENTS.BASE}${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    create: async (data: CreatePatientDto, token: string): Promise<Patient> => {
        const response = await axios.post(API_ENDPOINTS.PATIENTS.BASE, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    update: async (id: string, data: UpdatePatientDto, token: string): Promise<Patient> => {
        const response = await axios.put(`${API_ENDPOINTS.PATIENTS.BASE}${id}/`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    delete: async (id: string, token: string): Promise<void> => {
        await axios.delete(`${API_ENDPOINTS.PATIENTS.BASE}${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default patientService; 