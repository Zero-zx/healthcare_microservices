import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { setCredentials, setError, setLoading, logout } from '../store/slices/authSlice';
import { RootState } from '../store';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';
import authService from '../services/authService';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, loading, error } = useAppSelector((state: RootState) => state.auth);

    const login = useCallback(async (data: LoginRequest) => {
        try {
            dispatch(setLoading(true));
            const response = await authService.login(data);
            dispatch(setCredentials(response));
            return response;
        } catch (error: any) {
            dispatch(setError(error.response?.data?.message || 'Login failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const register = useCallback(async (data: RegisterRequest) => {
        try {
            dispatch(setLoading(true));
            const response = await authService.register(data);
            dispatch(setCredentials(response));
            return response;
        } catch (error: any) {
            dispatch(setError(error.response?.data?.message || 'Registration failed'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleLogout = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    return {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout: handleLogout
    };
}; 