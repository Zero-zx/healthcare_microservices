import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import { useApi } from './useApi';
import { RootState } from '../store';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { execute: loginApi } = useApi<{ token: string }>();
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      await loginApi({
        method: 'POST',
        url: '/api/auth/login',
        data: credentials,
      });
      dispatch(loginSuccess('token'));
      navigate('/dashboard');
    } catch (error) {
      dispatch(loginFailure('Login failed'));
    }
  }, [dispatch, loginApi, navigate]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  return {
    isAuthenticated,
    login,
    logout: handleLogout,
  };
}; 