import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import { Appointment } from '../types/appointment';

// Define Patient and Doctor types (adjust if necessary)
interface Patient {
  user_id: string;  // Changed from id to user_id to match backend
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  medical_history?: string;
  created_at: string;
  updated_at: string;
}

interface Doctor {
  user_id: string;  // Changed from id to user_id to match backend
  name: string;
  specialty: string;
  license: string;
  phone: string;
  email: string;
}

// Adjusting form values to match backend snake_case expectations
interface AppointmentFormValues {
  patient_id: string;
  doctor_id: string;
  date: string;
  time: string;
  notes?: string;
  service_type: string;
  duration: number;
}

const validationSchema = Yup.object({
  patient_id: Yup.string().required('Patient is required'),
  doctor_id: Yup.string().required('Doctor is required'),
  date: Yup.date().required('Date is required'),
  time: Yup.string().required('Time is required'),
  notes: Yup.string(),
  service_type: Yup.string().required('Service type is required'),
  duration: Yup.number()
    .min(15, 'Duration must be at least 15 minutes')
    .max(240, 'Duration cannot exceed 240 minutes')
    .required('Duration is required'),
});

const Appointments: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        console.log('Fetching data with headers:', headers);

        // Try fetching each service separately to identify which one is failing
        try {
          const patientsResponse = await axios.get('http://localhost:8004/api/patients/', { headers });
          console.log('Patients Response:', patientsResponse.data);
          setPatients(patientsResponse.data);
        } catch (error) {
          console.error('Error fetching patients:', error);
        }

        try {
          const doctorsResponse = await axios.get('http://localhost:8003/api/doctors/', { headers });
          console.log('Doctors Response:', doctorsResponse.data);
          setDoctors(doctorsResponse.data);
        } catch (error) {
          console.error('Error fetching doctors:', error);
        }

        try {
          const appointmentsResponse = await axios.get('http://localhost:8005/api/appointments/', { headers });
          console.log('Appointments Response:', appointmentsResponse.data);
          setAppointments(appointmentsResponse.data.results);
        } catch (error) {
          console.error('Error fetching appointments:', error);
        }

      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik<AppointmentFormValues>({
    initialValues: {
      patient_id: '',
      doctor_id: '',
      date: '',
      time: '',
      notes: '',
      service_type: 'general',
      duration: 30,
    },
    validationSchema,
    onSubmit: async (values: AppointmentFormValues) => {
      try {
        const token = localStorage.getItem('token');
        console.log('Creating appointment with values:', values);
        
        // Format the data according to the backend expectations
        const appointmentData = {
          patient_id: values.patient_id,
          doctor_id: values.doctor_id,
          date: values.date,
          time: values.time,
          notes: values.notes || '',
          status: 'pending', // Changed to match backend default
          service_type: values.service_type,
          duration: values.duration
        };

        console.log('Sending appointment data:', appointmentData);

        const response = await axios.post(
          'http://localhost:8005/api/appointments/',
          appointmentData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Appointment created successfully:', response.data);
        
        // Refresh appointments list
        try {
          const appointmentsResponse = await axios.get('http://localhost:8005/api/appointments/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          console.log('Refreshed appointments:', appointmentsResponse.data);
          setAppointments(appointmentsResponse.data.results);
        } catch (error) {
          console.error('Error refreshing appointments:', error);
        }

        formik.resetForm();
      } catch (error: any) {
        console.error('Error creating appointment:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
        }
      }
    },
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Schedule Appointment
        </Typography>
        <Paper sx={{ p: 3 }}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.patient_id && Boolean(formik.errors.patient_id)}>
                  <InputLabel id="patient_id-label">Patient</InputLabel>
                  <Select
                    labelId="patient_id-label"
                    id="patient_id"
                    name="patient_id"
                    value={formik.values.patient_id}
                    onChange={formik.handleChange}
                    label="Patient"
                  >
                    {patients.map((patient) => (
                      <MenuItem key={patient.user_id} value={patient.user_id}>
                        {patient.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.patient_id && formik.errors.patient_id && (
                    <Typography color="error" variant="caption">
                      {formik.errors.patient_id}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={formik.touched.doctor_id && Boolean(formik.errors.doctor_id)}>
                  <InputLabel id="doctor_id-label">Doctor</InputLabel>
                  <Select
                    labelId="doctor_id-label"
                    id="doctor_id"
                    name="doctor_id"
                    value={formik.values.doctor_id}
                    onChange={formik.handleChange}
                    label="Doctor"
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.user_id} value={doctor.user_id}>
                        {doctor.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.doctor_id && formik.errors.doctor_id && (
                    <Typography color="error" variant="caption">
                      {formik.errors.doctor_id}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="date"
                  name="date"
                  label="Date"
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="time"
                  name="time"
                  label="Time"
                  type="time"
                  value={formik.values.time}
                  onChange={formik.handleChange}
                  error={formik.touched.time && Boolean(formik.errors.time)}
                  helperText={formik.touched.time && formik.errors.time}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="notes"
                  name="notes"
                  label="Notes"
                  multiline
                  rows={4}
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  error={formik.touched.notes && Boolean(formik.errors.notes)}
                  helperText={formik.touched.notes && formik.errors.notes}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="service_type"
                  name="service_type"
                  label="Service Type"
                  value={formik.values.service_type}
                  onChange={formik.handleChange}
                  error={formik.touched.service_type && Boolean(formik.errors.service_type)}
                  helperText={formik.touched.service_type && formik.errors.service_type}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="duration"
                  name="duration"
                  label="Duration (minutes)"
                  type="number"
                  value={formik.values.duration}
                  onChange={formik.handleChange}
                  error={formik.touched.duration && Boolean(formik.errors.duration)}
                  helperText={formik.touched.duration && formik.errors.duration}
                  InputProps={{
                    inputProps: { min: 15, max: 240 }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  type="submit"
                >
                  Schedule Appointment
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>

      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Appointment History
        </Typography>
        <Paper sx={{ p: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(appointments) ? (
                  appointments.map((appointment) => {
                    const patient = patients.find(p => p.user_id === appointment.patient_id);
                    const doctor = doctors.find(d => d.user_id === appointment.doctor_id);
                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>{patient?.name || 'Unknown Patient'}</TableCell>
                        <TableCell>{doctor?.name || 'Unknown Doctor'}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.service_type}</TableCell>
                        <TableCell>{appointment.duration} min</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>No appointments found or data error.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default Appointments; 