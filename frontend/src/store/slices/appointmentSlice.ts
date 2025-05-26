import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appointment } from '../../types/appointment';

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state: AppointmentState, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },
    addAppointment: (state: AppointmentState, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (state: AppointmentState, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex((a: Appointment) => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    deleteAppointment: (state: AppointmentState, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter((a: Appointment) => a.id !== action.payload);
    },
    setLoading: (state: AppointmentState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state: AppointmentState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  setLoading,
  setError,
} = appointmentSlice.actions;

export default appointmentSlice.reducer; 