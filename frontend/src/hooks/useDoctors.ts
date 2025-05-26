import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { RootState } from '../store';
import {
  setDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  setLoading,
  setError,
} from '../store/slices/doctorSlice';
import axios from 'axios';
import { Doctor } from '../types/user';

interface DoctorState {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8003';

export const useDoctors = () => {
  const dispatch = useAppDispatch();
  const doctors = useAppSelector((state: RootState) => (state.doctors as DoctorState).doctors);
  const loading = useAppSelector((state: RootState) => (state.doctors as DoctorState).loading);
  const error = useAppSelector((state: RootState) => (state.doctors as DoctorState).error);

  const fetchDoctors = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/doctor/doctors/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        dispatch(setDoctors(response.data));
      }
    } catch (error) {
      dispatch(setError('Failed to fetch doctors'));
      console.error('Error fetching doctors:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createDoctor = useCallback(async (doctorData: Omit<Doctor, 'id'>) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/doctor/doctors/`, doctorData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        dispatch(addDoctor(response.data));
      }
    } catch (error) {
      dispatch(setError('Failed to create doctor'));
      console.error('Error creating doctor:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const updateDoctorById = useCallback(async (id: string, doctorData: Partial<Doctor>) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/doctor/doctors/${id}/`, doctorData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        dispatch(updateDoctor(response.data));
      }
    } catch (error) {
      dispatch(setError('Failed to update doctor'));
      console.error('Error updating doctor:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const deleteDoctorById = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/doctor/doctors/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(deleteDoctor(id));
    } catch (error) {
      dispatch(setError('Failed to delete doctor'));
      console.error('Error deleting doctor:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    doctors,
    loading,
    error,
    fetchDoctors,
    createDoctor,
    updateDoctor: updateDoctorById,
    deleteDoctor: deleteDoctorById,
  };
}; 