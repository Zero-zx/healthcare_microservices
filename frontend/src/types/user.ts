export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    created_at: string;
    updated_at: string;
}

export interface CreateUserDto {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
}

export interface UpdateUserDto {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    address?: string;
}

export interface Patient {
    id: string;
    email: string;
    name: string;
    age: number;
    gender: string;
    phone: string;
    address: string;
    medical_history?: string;
    patient_type: 'normal' | 'remote' | 'vip';
    preferred_contact_method?: 'phone' | 'email' | 'video';
    timezone?: string;
    created_at: string;
    updated_at: string;
}

export interface CreatePatientDto {
    email: string;
    name: string;
    age: number;
    gender: string;
    phone: string;
    address: string;
    medical_history?: string;
    patient_type: 'normal' | 'remote' | 'vip';
    preferred_contact_method?: 'phone' | 'email' | 'video';
    timezone?: string;
}

export interface UpdatePatientDto {
    email?: string;
    name?: string;
    age?: number;
    gender?: string;
    phone?: string;
    address?: string;
    medical_history?: string;
    patient_type?: 'normal' | 'remote' | 'vip';
    preferred_contact_method?: 'phone' | 'email' | 'video';
    timezone?: string;
}

export interface Doctor {
    id: string;
    email: string;
    name: string;
    specialization: string;
    license_number: string;
    years_of_experience: number;
    education: string;
    certifications?: string;
    languages: string;
    created_at: string;
    updated_at: string;
}

export interface CreateDoctorDto {
    email: string;
    name: string;
    specialization: string;
    license_number: string;
    years_of_experience: number;
    education: string;
    certifications?: string;
    languages: string;
}

export interface UpdateDoctorDto {
    email?: string;
    name?: string;
    specialization?: string;
    license_number?: string;
    years_of_experience?: number;
    education?: string;
    certifications?: string;
    languages?: string;
} 