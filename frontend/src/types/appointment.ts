export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  service_type: string;
  duration: number;
}

export interface AppointmentResponse {
  status: number;
  data: Appointment | Appointment[];
  message?: string;
} 