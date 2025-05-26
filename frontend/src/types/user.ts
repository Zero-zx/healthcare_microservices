export interface Patient {
    user_id: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    phone: string;
    email: string;
    address: string;
    medical_history?: string;
    patient_type: 'guest' | 'offline' | 'remote';
    preferred_contact_method?: 'phone' | 'email' | 'video';
    timezone?: string;
    created_at: string;
    updated_at: string;
}

export interface Doctor {
    user_id: string;
    name: string;
    specialty: string;
    license: string;
    phone: string;
    email: string;
}

export interface CreatePatientDto {
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    phone: string;
    email: string;
    address: string;
    medical_history?: string;
    patient_type: 'guest' | 'offline' | 'remote';
    preferred_contact_method?: 'phone' | 'email' | 'video';
    timezone?: string;
}

export interface CreateDoctorDto {
    name: string;
    specialty: string;
    license: string;
    phone: string;
    email: string;
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> {}
export interface UpdateDoctorDto extends Partial<CreateDoctorDto> {} 