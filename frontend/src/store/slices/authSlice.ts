import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types/auth';

const mockUser: User = {
    id: '1',
    email: 'admin@example.com',
    role: 'admin',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

const initialState: AuthState = {
    user: mockUser,
    access: 'mock-access-token',
    refresh: 'mock-refresh-token',
    isAuthenticated: true,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User; access: string; refresh: string }>) => {
            state.user = action.payload.user;
            state.access = action.payload.access;
            state.refresh = action.payload.refresh;
            state.isAuthenticated = true;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = mockUser;
            state.access = 'mock-access-token';
            state.refresh = 'mock-refresh-token';
            state.isAuthenticated = true;
            state.error = null;
        }
    }
});

export const { setCredentials, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer; 