export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  service_type: string;
  duration: number;
  created_at: string;
  updated_at: string;
}

// Django REST Framework pagination response
export interface AppointmentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Appointment[];
}

export interface AppointmentResponse {
  status: number;
  data: Appointment | Appointment[];
  message?: string;
} 