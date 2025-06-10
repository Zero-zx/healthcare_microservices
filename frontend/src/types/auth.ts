export interface User {
    id: string;
    email: string;
    role: 'patient' | 'doctor' | 'admin';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        username: string;
        role: 'patient' | 'doctor' | 'admin';
        is_active: boolean;
        created_at: string;
        updated_at: string;
    };
    access: string;
    refresh: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
    password2: string;
    role: 'patient' | 'doctor';
    // Patient-specific fields
    name?: string;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    phone?: string;
    address?: string;
    // Doctor-specific fields
    specialization?: string;
    license_number?: string;
    years_of_experience?: number;
}

export interface AuthState {
    user: User | null;
    access: string | null;
    refresh: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
} 