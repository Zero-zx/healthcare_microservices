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
  Chip,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import { Appointment } from '../types/appointment';
import { Patient, Doctor } from '../types/user';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

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

const API_URL = process.env.REACT_APP_APPOINTMENT_API_URL || 'http://localhost:8000/api/appointments/';
const PATIENT_API_URL = process.env.REACT_APP_PATIENT_API_URL || 'http://localhost:8000/api/patients/';
const DOCTOR_API_URL = process.env.REACT_APP_DOCTOR_API_URL || 'http://localhost:8000/api/doctors/';

const Appointments: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const config = { headers, withCredentials: true };

        console.log('Starting to fetch data...');

        // Fetch patients
        try {
          console.log('Fetching patients from:', PATIENT_API_URL);
          const patientsResponse = await axios.get(PATIENT_API_URL, config);
          console.log('Patients Response Status:', patientsResponse.status);
          console.log('Patients Response Data:', JSON.stringify(patientsResponse.data, null, 2));
          setPatients(patientsResponse.data);
        } catch (error) {
          console.error('Error fetching patients:', error);
          if (axios.isAxiosError(error)) {
            console.error('Error details:', {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data
            });
          }
        }

        // Fetch doctors
        try {
          console.log('Fetching doctors from:', DOCTOR_API_URL);
          const doctorsResponse = await axios.get(DOCTOR_API_URL, config);
          console.log('Doctors Response Status:', doctorsResponse.status);
          console.log('Doctors Response Data:', JSON.stringify(doctorsResponse.data, null, 2));
          setDoctors(doctorsResponse.data);
        } catch (error) {
          console.error('Error fetching doctors:', error);
          if (axios.isAxiosError(error)) {
            console.error('Error details:', {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data
            });
          }
        }

        // Fetch appointments
        try {
          console.log('Fetching appointments from:', API_URL);
          const appointmentsResponse = await axios.get(API_URL, config);
          console.log('Appointments Response Status:', appointmentsResponse.status);
          console.log('Appointments Response Data:', JSON.stringify(appointmentsResponse.data, null, 2));
          // Check if the response has a results array
          const appointmentsData = appointmentsResponse.data.results || appointmentsResponse.data;
          console.log('Processed appointments data:', appointmentsData);
          setAppointments(appointmentsData);
        } catch (error) {
          console.error('Error fetching appointments:', error);
          if (axios.isAxiosError(error)) {
            console.error('Error details:', {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data
            });
          }
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
        
        const appointmentData = {
          patient_id: values.patient_id,
          doctor_id: values.doctor_id,
          date: values.date,
          time: values.time,
          notes: values.notes || '',
          status: 'pending',
          service_type: values.service_type,
          duration: values.duration
        };

        console.log('Sending appointment data:', appointmentData);

        const response = await axios.post(
          API_URL,
          appointmentData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true
          }
        );

        console.log('Appointment created successfully:', response.data);
        
        // Refresh appointments list
        try {
          const appointmentsResponse = await axios.get(API_URL, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true
          });
          console.log('Refreshed appointments:', appointmentsResponse.data);
          // Check if the response has a results array
          const appointmentsData = appointmentsResponse.data.results || appointmentsResponse.data;
          console.log('Processed appointments data:', appointmentsData);
          setAppointments(appointmentsData);
        } catch (error) {
          console.error('Error refreshing appointments:', error);
        }

        formik.resetForm();
      } catch (error: any) {
        console.error('Error creating appointment:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      }
    },
  });

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    formik.setValues({
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes || '',
      service_type: appointment.service_type,
      duration: appointment.duration
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      // Refresh appointments list
      const appointmentsResponse = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      const appointmentsData = appointmentsResponse.data.results || appointmentsResponse.data;
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                      <MenuItem key={patient.id} value={patient.id}>
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
                      <MenuItem key={doctor.id} value={doctor.id}>
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Patient Details</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Doctor Details</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patient_id);
                  const doctor = doctors.find(d => d.id === appointment.doctor_id);
                  
                  return (
                    <TableRow key={appointment.id}>
                      <TableCell>{patient ? patient.name : 'Unknown Patient'}</TableCell>
                      <TableCell>
                        {patient ? (
                          <>
                            Phone: {patient.phone}<br />
                            {patient.patient_type && `Type: ${patient.patient_type}`}
                          </>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>{doctor ? doctor.name : 'Unknown Doctor'}</TableCell>
                      <TableCell>
                        {doctor ? (
                          <>
                            {doctor.specialization && `Specialization: ${doctor.specialization}`}
                          </>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {new Date(`${appointment.date}T${appointment.time}`).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.status}
                          color={
                            appointment.status === 'confirmed' ? 'primary' :
                            appointment.status === 'completed' ? 'success' :
                            appointment.status === 'cancelled' ? 'error' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(appointment)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(appointment.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default Appointments; 