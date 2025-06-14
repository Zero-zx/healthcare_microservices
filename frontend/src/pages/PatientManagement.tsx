import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import patientService from '../services/patientService';
import { Patient, CreatePatientDto, UpdatePatientDto } from '../types/user';
import { useAppSelector } from '../hooks/useAppSelector';
import { RootState } from '../store';

const PatientManagement: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [formData, setFormData] = useState<Partial<CreatePatientDto>>({
        email: '',
        name: '',
        age: 0,
        gender: 'male',
        phone: '',
        address: '',
        patient_type: 'normal'
    });

    const { access } = useAppSelector((state: RootState) => state.auth);
    const token = access || 'mock-access-token';

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            const data = await patientService.getAll(token);
            setPatients(data);
        } catch (error) {
            console.error('Error loading patients:', error);
        }
    };

    const handleOpen = (patient?: Patient) => {
        if (patient) {
            setSelectedPatient(patient);
            setFormData({
                email: patient.email,
                name: patient.name,
                age: patient.age,
                gender: patient.gender,
                phone: patient.phone,
                address: patient.address,
                patient_type: patient.patient_type,
                medical_history: patient.medical_history,
                preferred_contact_method: patient.preferred_contact_method,
                timezone: patient.timezone
            });
        } else {
            setSelectedPatient(null);
            setFormData({
                email: '',
                name: '',
                age: 0,
                gender: 'male',
                phone: '',
                address: '',
                patient_type: 'normal'
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPatient(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name as string]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedPatient) {
                await patientService.update(selectedPatient.id, formData as UpdatePatientDto, token);
            } else {
                await patientService.create(formData as CreatePatientDto, token);
            }
            handleClose();
            loadPatients();
        } catch (error) {
            console.error('Error saving patient:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await patientService.delete(id, token);
                loadPatients();
            } catch (error) {
                console.error('Error deleting patient:', error);
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4" component="h1">
                    Patient Management
                </Typography>
                <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                    Add Patient
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((patient) => (
                            <TableRow key={patient.id}>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell>{patient.email}</TableCell>
                                <TableCell>{patient.phone}</TableCell>
                                <TableCell>{patient.patient_type}</TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        onClick={() => handleOpen(patient)}
                                        sx={{ mr: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(patient.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedPatient ? 'Edit Patient' : 'Add Patient'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Age"
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Gender</InputLabel>
                            <Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                label="Gender"
                                required
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            margin="normal"
                            required
                            multiline
                            rows={3}
                        />
                        <TextField
                            fullWidth
                            label="Medical History"
                            name="medical_history"
                            value={formData.medical_history}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Patient Type</InputLabel>
                            <Select
                                name="patient_type"
                                value={formData.patient_type}
                                onChange={handleChange}
                                label="Patient Type"
                                required
                            >
                                <MenuItem value="normal">Normal</MenuItem>
                                <MenuItem value="remote">Remote</MenuItem>
                                <MenuItem value="vip">VIP</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Preferred Contact Method</InputLabel>
                            <Select
                                name="preferred_contact_method"
                                value={formData.preferred_contact_method}
                                onChange={handleChange}
                                label="Preferred Contact Method"
                            >
                                <MenuItem value="phone">Phone</MenuItem>
                                <MenuItem value="email">Email</MenuItem>
                                <MenuItem value="video">Video Call</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Timezone"
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleChange}
                            margin="normal"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {selectedPatient ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PatientManagement; 