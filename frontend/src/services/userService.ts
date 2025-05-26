import axios from 'axios';
import { Patient, Doctor, CreatePatientDto, CreateDoctorDto, UpdatePatientDto, UpdateDoctorDto } from '../types/user';

const PATIENT_API_URL = process.env.REACT_APP_PATIENT_API_URL || 'http://localhost:8004';
const DOCTOR_API_URL = process.env.REACT_APP_DOCTOR_API_URL || 'http://localhost:8003';

// Patient Services
export const patientService = {
    getAll: async (): Promise<Patient[]> => {
        const response = await axios.get(`${PATIENT_API_URL}/api/patients/patients/`);
        return response.data;
    },

    getById: async (id: string): Promise<Patient> => {
        const response = await axios.get(`${PATIENT_API_URL}/api/patients/${id}/`);
        return response.data;
    },

    create: async (patient: CreatePatientDto): Promise<Patient> => {
        const response = await axios.post(`${PATIENT_API_URL}/api/patients/`, patient);
        return response.data;
    },

    update: async (id: string, patient: UpdatePatientDto): Promise<Patient> => {
        const response = await axios.put(`${PATIENT_API_URL}/api/patients/${id}/`, patient);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axios.delete(`${PATIENT_API_URL}/api/patients/${id}/`);
    }
};

// Doctor Services
export const doctorService = {
    getAll: async (): Promise<Doctor[]> => {
        const response = await axios.get(`${DOCTOR_API_URL}/api/doctors/`);
        return response.data;
    },

    getById: async (id: string): Promise<Doctor> => {
        const response = await axios.get(`${DOCTOR_API_URL}/api/doctors/${id}/`);
        return response.data;
    },

    create: async (doctor: CreateDoctorDto): Promise<Doctor> => {
        console.log('Creating doctor with data:', JSON.stringify(doctor, null, 2));
        try {
            const response = await axios.post(`${DOCTOR_API_URL}/api/doctors/`, doctor);
            console.log('Server response:', response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error details:', {
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
        const response = await axios.put(`${DOCTOR_API_URL}/api/doctors/${id}/`, doctor);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axios.delete(`${DOCTOR_API_URL}/api/doctors/${id}/`);
    }
}; 