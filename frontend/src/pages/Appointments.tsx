import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Paper, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, SelectChangeEvent } from '@mui/material';
import axios from 'axios';

interface Patient {
  user_id: string;
  user?: string;
  name: string;
}

interface Doctor {
  user_id: string;
  user?: string;
  name: string;
}

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  time: string;
  service_type: string;
  duration: number;
  status: string;
}

const Appointments: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    date: '',
    time: '',
    service_type: '',
    duration: 30,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
          axios.get('http://localhost:8004/api/patients/'),
          axios.get('http://localhost:8003/api/doctors/'),
          axios.get('http://localhost:8005/api/appointments/'),
        ]);
        // Map user to string if needed
        const mappedPatients = (Array.isArray(patientsRes.data) ? patientsRes.data : patientsRes.data.results || []).map((p: any) => ({
          ...p,
          user: typeof p.user === 'object' && p.user !== null ? p.user.id : p.user,
        }));
        const mappedDoctors = (Array.isArray(doctorsRes.data) ? doctorsRes.data : doctorsRes.data.results || []).map((d: any) => ({
          ...d,
          user: typeof d.user === 'object' && d.user !== null ? d.user.id : d.user,
        }));
        setPatients(mappedPatients);
        setDoctors(mappedDoctors);
        setAppointments(appointmentsRes.data.results || []);
        console.log('Fetched patients:', mappedPatients);
        console.log('Fetched doctors:', mappedDoctors);
        console.log('Fetched appointments:', appointmentsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    console.log('Dropdown changed:', name, value);
    setForm(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Defensive: ensure time is in HH:MM:SS
    const timeValue = form.time.length === 5 ? form.time + ':00' : form.time;
    const payload = {
      ...form,
      patient_id: String(form.patient_id),
      doctor_id: String(form.doctor_id),
      time: timeValue,
      status: 'pending',
    };
    console.log('typeof patient_id:', typeof payload.patient_id, 'value:', payload.patient_id);
    console.log('Submitting appointment payload:', payload);
    // Log types and values
    Object.entries(payload).forEach(([k, v]) => {
      console.log(`${k}:`, v, 'type:', typeof v);
    });
    // Check for empty required fields
    if (!payload.patient_id || !payload.doctor_id || !payload.date || !payload.time || !payload.service_type || !payload.duration) {
      alert('All fields are required!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8005/api/appointments/', payload);
      console.log('POST response:', response.data);
      const appointmentsRes = await axios.get('http://localhost:8005/api/appointments/');
      setAppointments(appointmentsRes.data.results || []);
      setForm({ patient_id: '', doctor_id: '', date: '', time: '', service_type: '', duration: 30 });
      alert('Appointment scheduled!');
    } catch (err: any) {
      if (err.response) {
        console.error('Backend error:', err.response.data);
        alert('Backend error: ' + JSON.stringify(err.response.data));
      } else {
        console.error('Error scheduling appointment:', err);
        alert('Error scheduling appointment. See console for details.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Schedule Appointment</Typography>
        <Paper sx={{ p: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Select
                  fullWidth
                  name="patient_id"
                  value={form.patient_id}
                  onChange={handleSelectChange}
                  displayEmpty
                >
                  <MenuItem value=""><em>Select Patient</em></MenuItem>
                  {patients.map(p => (
                    <MenuItem key={p.user} value={String(p.user)}>{p.name}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Select
                  fullWidth
                  name="doctor_id"
                  value={form.doctor_id}
                  onChange={handleSelectChange}
                  displayEmpty
                >
                  <MenuItem value=""><em>Select Doctor</em></MenuItem>
                  {doctors.map(d => (
                    <MenuItem key={d.user} value={String(d.user)}>{d.name}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="date"
                  label="Date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="time"
                  label="Time"
                  type="time"
                  value={form.time}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="service_type"
                  label="Service Type"
                  value={form.service_type}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="duration"
                  label="Duration (minutes)"
                  type="number"
                  value={form.duration}
                  onChange={handleChange}
                  inputProps={{ min: 15, max: 240 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Schedule Appointment
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Appointments</Typography>
        <Paper sx={{ p: 2 }}>
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
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map(app => (
                  <TableRow key={app.id}>
                    <TableCell>{patients.find(p => p.user === app.patient_id)?.name || app.patient_id}</TableCell>
                    <TableCell>{doctors.find(d => d.user === app.doctor_id)?.name || app.doctor_id}</TableCell>
                    <TableCell>{app.date}</TableCell>
                    <TableCell>{app.time}</TableCell>
                    <TableCell>{app.service_type}</TableCell>
                    <TableCell>{app.duration}</TableCell>
                    <TableCell>{app.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default Appointments; 