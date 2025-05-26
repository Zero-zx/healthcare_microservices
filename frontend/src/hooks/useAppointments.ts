import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { useApi } from './useApi';
import { RootState } from '../store';
import {
  setAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  setLoading,
  setError,
} from '../store/slices/appointmentSlice';
import axios from 'axios';
import { Appointment, AppointmentResponse } from '../types/appointment';

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

export const useAppointments = () => {
  const dispatch = useAppDispatch();
  const { execute: appointmentsApi } = useApi<Appointment[]>();
  const appointments = useAppSelector((state: RootState) => (state.appointments as AppointmentState).appointments);
  const loading = useAppSelector((state: RootState) => (state.appointments as AppointmentState).loading);
  const error = useAppSelector((state: RootState) => (state.appointments as AppointmentState).error);

  const fetchAppointments = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const response = await axios.get<AppointmentResponse>('http://localhost:8005/api/appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        dispatch(setAppointments(response.data.data as Appointment[]));
      }
    } catch (error) {
      dispatch(setError('Failed to fetch appointments'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createAppointment = useCallback(async (appointment: Omit<Appointment, 'id'>) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const response = await axios.post<AppointmentResponse>(
        'http://localhost:8005/api/appointments',
        appointment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 201) {
        dispatch(addAppointment(response.data.data as Appointment));
      }
    } catch (error) {
      dispatch(setError('Failed to create appointment'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const updateAppointmentById = useCallback(async (id: string, appointment: Partial<Appointment>) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const response = await axios.put<AppointmentResponse>(
        `http://localhost:8000/api/appointments/${id}`,
        appointment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        dispatch(updateAppointment(response.data.data as Appointment));
      }
    } catch (error) {
      dispatch(setError('Failed to update appointment'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const deleteAppointmentById = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const response = await axios.delete<AppointmentResponse>(
        `http://localhost:8000/api/appointments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        dispatch(deleteAppointment(id));
      }
    } catch (error) {
      dispatch(setError('Failed to delete appointment'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment: updateAppointmentById,
    deleteAppointment: deleteAppointmentById,
  };
}; 