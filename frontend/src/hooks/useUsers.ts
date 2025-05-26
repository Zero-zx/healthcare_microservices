import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { useApi } from './useApi';
import { RootState } from '../store';
import {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setLoading,
  setError,
} from '../store/slices/userSlice';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  status: 'active' | 'inactive';
}

interface ApiResponse<T> {
  status: number;
  data: T;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const { execute: usersApi } = useApi<User[]>();
  const users = useAppSelector((state: RootState) => (state.users as UserState).users);
  const loading = useAppSelector((state: RootState) => (state.users as UserState).loading);
  const error = useAppSelector((state: RootState) => (state.users as UserState).error);

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse<User[]>>('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.status === 200) {
        dispatch(setUsers(response.data.data));
      }
    } catch (error) {
      dispatch(setError('Failed to fetch users'));
    }
  }, [dispatch]);

  const createUser = useCallback(async (userData: Omit<User, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post<ApiResponse<User>>('/api/users', userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.status === 201) {
        dispatch(addUser(response.data.data));
      }
    } catch (error) {
      dispatch(setError('Failed to create user'));
    }
  }, [dispatch]);

  const updateUserById = useCallback(async (id: string, userData: Partial<User>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put<ApiResponse<User>>(`/api/users/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.status === 200) {
        dispatch(updateUser(response.data.data));
      }
    } catch (error) {
      dispatch(setError('Failed to update user'));
    }
  }, [dispatch]);

  const deleteUserById = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true));
      await usersApi({
        method: 'DELETE',
        url: `/api/users/${id}`,
      });
      dispatch(deleteUser(id));
    } catch (error) {
      dispatch(setError('Failed to delete user'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, usersApi]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser: updateUserById,
    deleteUser: deleteUserById,
  };
}; 