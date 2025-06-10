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
import { Appointment, AppointmentListResponse } from '../types/appointment';

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
      const response = await axios.get<AppointmentListResponse>('http://localhost:8005/api/appointments/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Handle Django REST Framework pagination response
      dispatch(setAppointments(response.data.results || []));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      dispatch(setError('Failed to fetch appointments'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createAppointment = useCallback(async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const response = await axios.post<Appointment>(
        'http://localhost:8005/api/appointments/',
        appointment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // Django REST Framework returns the created object directly
      dispatch(addAppointment(response.data));
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      dispatch(setError('Failed to create appointment'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const updateAppointmentById = useCallback(async (id: string, appointment: Partial<Appointment>) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const response = await axios.put<Appointment>(
        `http://localhost:8005/api/appointments/${id}/`,
        appointment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch(updateAppointment(response.data));
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      dispatch(setError('Failed to update appointment'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const deleteAppointmentById = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:8005/api/appointments/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(deleteAppointment(id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      dispatch(setError('Failed to delete appointment'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const confirmAppointment = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8005/api/appointments/${id}/confirm/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh appointments after confirmation
      await fetchAppointments();
      return response.data;
    } catch (error) {
      console.error('Error confirming appointment:', error);
      dispatch(setError('Failed to confirm appointment'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, fetchAppointments]);

  const cancelAppointment = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8005/api/appointments/${id}/cancel/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh appointments after cancellation
      await fetchAppointments();
      return response.data;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      dispatch(setError('Failed to cancel appointment'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, fetchAppointments]);

  const completeAppointment = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8005/api/appointments/${id}/complete/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh appointments after completion
      await fetchAppointments();
      return response.data;
    } catch (error) {
      console.error('Error completing appointment:', error);
      dispatch(setError('Failed to complete appointment'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment: updateAppointmentById,
    deleteAppointment: deleteAppointmentById,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
  };
}; 