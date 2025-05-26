import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { RootState } from '../store';
import {
  setPatients,
  addPatient,
  updatePatient,
  deletePatient,
  setLoading,
  setError,
} from '../store/slices/patientSlice';
import axios from 'axios';
import { Patient } from '../types/user';

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8004';

export const usePatients = () => {
  const dispatch = useAppDispatch();
  const patients = useAppSelector((state: RootState) => (state.patients as PatientState).patients);
  const loading = useAppSelector((state: RootState) => (state.patients as PatientState).loading);
  const error = useAppSelector((state: RootState) => (state.patients as PatientState).error);

  const fetchPatients = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/patients/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        dispatch(setPatients(response.data));
      }
    } catch (error) {
      dispatch(setError('Failed to fetch patients'));
      console.error('Error fetching patients:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createPatient = useCallback(async (patientData: Omit<Patient, 'id'>) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/patients/`, patientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        dispatch(addPatient(response.data));
      }
    } catch (error) {
      dispatch(setError('Failed to create patient'));
      console.error('Error creating patient:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const updatePatientById = useCallback(async (id: string, patientData: Partial<Patient>) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/api/patients/${id}/`, patientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        dispatch(updatePatient(response.data));
      }
    } catch (error) {
      dispatch(setError('Failed to update patient'));
      console.error('Error updating patient:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const deletePatientById = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/patients/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(deletePatient(id));
    } catch (error) {
      dispatch(setError('Failed to delete patient'));
      console.error('Error deleting patient:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    createPatient,
    updatePatient: updatePatientById,
    deletePatient: deletePatientById,
  };
}; 