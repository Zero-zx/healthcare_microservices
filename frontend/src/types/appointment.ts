export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface AppointmentResponse {
  status: number;
  data: Appointment | Appointment[];
  message?: string;
} 