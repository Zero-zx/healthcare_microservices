import axios from 'axios';
import { Patient, Doctor, CreatePatientDto, CreateDoctorDto, UpdatePatientDto, UpdateDoctorDto, User, CreateUserDto, UpdateUserDto } from '../types/user';

// Use relative URL since we're using the proxy
const API_URL = '/api';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// Patient Services
export const patientService = {
    getAll: async (): Promise<Patient[]> => {
        const response = await axios.get(`${API_URL}/patients/`);
        return response.data;
    },

    getById: async (id: string): Promise<Patient> => {
        const response = await axios.get(`${API_URL}/patients/${id}/`);
        return response.data;
    },

    create: async (patient: CreatePatientDto): Promise<Patient> => {
        const response = await axios.post(`${API_URL}/patients/`, patient);
        return response.data;
    },

    update: async (id: string, patient: UpdatePatientDto): Promise<Patient> => {
        const response = await axios.put(`${API_URL}/patients/${id}/`, patient);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/patients/${id}/`);
    }
};

// Doctor Services
export const doctorService = {
    getAll: async (): Promise<Doctor[]> => {
        const response = await axios.get(`${API_URL}/doctors/`);
        return response.data;
    },

    getById: async (id: string): Promise<Doctor> => {
        const response = await axios.get(`${API_URL}/doctors/${id}/`);
        return response.data;
    },

    create: async (doctor: CreateDoctorDto): Promise<Doctor> => {
        const response = await axios.post(`${API_URL}/doctors/`, doctor);
        return response.data;
    },

    update: async (id: string, doctor: UpdateDoctorDto): Promise<Doctor> => {
        const response = await axios.put(`${API_URL}/doctors/${id}/`, doctor);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/doctors/${id}/`);
    }
};

// User Services
export const userService = {
    getAll: async (): Promise<User[]> => {
        const response = await axios.get(`${API_URL}/users/`);
        return response.data;
    },

    getById: async (id: string): Promise<User> => {
        const response = await axios.get(`${API_URL}/users/${id}/`);
        return response.data;
    },

    create: async (user: CreateUserDto): Promise<User> => {
        const response = await axios.post(`${API_URL}/users/`, user);
        return response.data;
    },

    update: async (id: string, user: UpdateUserDto): Promise<User> => {
        const response = await axios.put(`${API_URL}/users/${id}/`, user);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/users/${id}/`);
    }
}; 