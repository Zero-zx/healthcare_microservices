import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { setCredentials, setError, logout } from '../store/slices/authSlice';
import { RootState } from '../store';
import { LoginRequest, AuthResponse } from '../types/auth';
import { authService } from '../services/authService';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAppSelector((state: RootState) => state.auth);

    const login = useCallback(async (credentials: LoginRequest) => {
        try {
            const response = await authService.login(credentials);
            dispatch(setCredentials(response));
            navigate('/dashboard');
        } catch (error: any) {
            dispatch(setError(error.response?.data?.error || 'Login failed'));
        }
    }, [dispatch, navigate]);

    const handleLogout = useCallback(() => {
        dispatch(logout());
        navigate('/login');
    }, [dispatch, navigate]);

    return {
        isAuthenticated,
        loading,
        login,
        logout: handleLogout,
    };
}; 