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
    TextField
} from '@mui/material';
import doctorService from '../services/doctorService';
import { Doctor, CreateDoctorDto, UpdateDoctorDto } from '../types/user';
import { useAppSelector } from '../hooks/useAppSelector';
import { RootState } from '../store';

const DoctorManagement: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [formData, setFormData] = useState<Partial<CreateDoctorDto>>({
        email: '',
        name: '',
        specialization: '',
        license_number: '',
        years_of_experience: 0,
        education: '',
        certifications: '',
        languages: ''
    });

    const { access } = useAppSelector((state: RootState) => state.auth);
    const token = access || 'mock-access-token';

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        try {
            const data = await doctorService.getAll(token);
            setDoctors(data);
        } catch (error) {
            console.error('Error loading doctors:', error);
        }
    };

    const handleOpen = (doctor?: Doctor) => {
        if (doctor) {
            setSelectedDoctor(doctor);
            setFormData({
                email: doctor.email,
                name: doctor.name,
                specialization: doctor.specialization,
                license_number: doctor.license_number,
                years_of_experience: doctor.years_of_experience,
                education: doctor.education,
                certifications: doctor.certifications,
                languages: doctor.languages
            });
        } else {
            setSelectedDoctor(null);
            setFormData({
                email: '',
                name: '',
                specialization: '',
                license_number: '',
                years_of_experience: 0,
                education: '',
                certifications: '',
                languages: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDoctor(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'years_of_experience' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedDoctor) {
                await doctorService.update(selectedDoctor.id, formData as UpdateDoctorDto, token);
            } else {
                await doctorService.create(formData as CreateDoctorDto, token);
            }
            handleClose();
            loadDoctors();
        } catch (error) {
            console.error('Error saving doctor:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await doctorService.delete(id, token);
                loadDoctors();
            } catch (error) {
                console.error('Error deleting doctor:', error);
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4" component="h1">
                    Doctor Management
                </Typography>
                <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                    Add Doctor
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Specialization</TableCell>
                            <TableCell>Experience</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {doctors.map((doctor) => (
                            <TableRow key={doctor.id}>
                                <TableCell>{doctor.name}</TableCell>
                                <TableCell>{doctor.email}</TableCell>
                                <TableCell>{doctor.specialization}</TableCell>
                                <TableCell>{doctor.years_of_experience} years</TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        onClick={() => handleOpen(doctor)}
                                        sx={{ mr: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(doctor.id)}
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
                    {selectedDoctor ? 'Edit Doctor' : 'Add Doctor'}
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
                            label="Specialization"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="License Number"
                            name="license_number"
                            value={formData.license_number}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Years of Experience"
                            name="years_of_experience"
                            type="number"
                            value={formData.years_of_experience}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Education"
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Certifications"
                            name="certifications"
                            value={formData.certifications}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={2}
                        />
                        <TextField
                            fullWidth
                            label="Languages"
                            name="languages"
                            value={formData.languages}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {selectedDoctor ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DoctorManagement; 