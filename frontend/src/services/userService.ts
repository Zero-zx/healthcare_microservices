import axios from 'axios';
import { Patient, Doctor, CreatePatientDto, CreateDoctorDto, UpdatePatientDto, UpdateDoctorDto } from '../types/user';

// Use relative URL since we're using the proxy
const API_URL = '/api';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// Patient Services
export const patientService = {
    getAll: async (): Promise<Patient[]> => {
        try {
            const response = await axios.get(`${API_URL}/patients/`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching patients:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.headers,
                });
            }
            throw error;
        }
    },

    getById: async (id: string): Promise<Patient> => {
        try {
            const response = await axios.get(`${API_URL}/patients/${id}/`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching patient:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }
            throw error;
        }
    },

    create: async (patient: CreatePatientDto): Promise<Patient> => {
        try {
            const response = await axios.post(`${API_URL}/patients/`, patient);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error creating patient:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }
            throw error;
        }
    },

    update: async (id: string, patient: UpdatePatientDto): Promise<Patient> => {
        try {
            const response = await axios.put(`${API_URL}/patients/${id}/`, patient);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error updating patient:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await axios.delete(`${API_URL}/patients/${id}/`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error deleting patient:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }
            throw error;
        }
    }
};

// Doctor Services
export const doctorService = {
    getAll: async (): Promise<Doctor[]> => {
        try {
            const response = await axios.get(`${API_URL}/doctors/`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching doctors:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }
            throw error;
        }
    },

    getById: async (id: string): Promise<Doctor> => {
        try {
            const response = await axios.get(`${API_URL}/doctors/${id}/`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching doctor:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }
            throw error;
        }
    },

    create: async (doctor: CreateDoctorDto): Promise<Doctor> => {
        try {
            console.log('Creating doctor with data:', JSON.stringify(doctor, null, 2));
            const response = await axios.post(`${API_URL}/doctors/`, doctor);
            console.log('Server response:', response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error creating doctor:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.headers,
                });
            }
            throw error;
        }
    },

    update: async (id: string, doctor: UpdateDoctorDto): Promise<Doctor> => {
        try {
            const response = await axios.put(`${API_URL}/doctors/${id}/`, doctor);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error updating doctor:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await axios.delete(`${API_URL}/doctors/${id}/`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error deleting doctor:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                });
            }
            throw error;
        }
    }
}; 