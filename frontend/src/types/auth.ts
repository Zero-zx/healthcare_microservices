export interface User {
    id: string;
    email: string;
    role: 'patient' | 'doctor' | 'admin';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    user: User;
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
}

export interface AuthState {
    user: User | null;
    access: string | null;
    refresh: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
} 