export interface Patient {
    id: string;
    user_id: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    phone: string;
    address: string;
    medical_history?: string | null;
    patient_type: 'current' | 'remote' | 'emergency' | 'referral' | 'chronic' | 'preventive';
    preferred_contact_method?: 'phone' | 'email' | 'video' | null;
    timezone?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Doctor {
    id: string;
    user_id: string;
    name?: string;
    specialization: string;
    license_number: string;
    years_of_experience: number;
    education: string;
    certifications?: string | null;
    languages: string;
    schedules?: any[];
    created_at: string;
    updated_at: string;
}

export interface CreatePatientDto {
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    phone: string;
    address: string;
    medical_history?: string;
    patient_type: 'current' | 'remote' | 'emergency' | 'referral' | 'chronic' | 'preventive';
    preferred_contact_method?: 'phone' | 'email' | 'video';
    timezone?: string;
}

export interface CreateDoctorDto {
    name: string;
    specialization: string;
    license_number: string;
    years_of_experience: number;
    education: string;
    certifications?: string;
    languages: string;
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> {}
export interface UpdateDoctorDto extends Partial<CreateDoctorDto> {} 