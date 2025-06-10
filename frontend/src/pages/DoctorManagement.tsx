import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Avatar,
    Skeleton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Doctor, CreateDoctorDto } from '../types/user';
import { doctorService } from '../services/userService';
import UserForm from '../components/UserForm';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

export const DoctorManagement: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const data = await doctorService.getAll();
            console.log('Doctors Data:', JSON.stringify(data, null, 2));
            setDoctors(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch doctors');
            console.error('Error fetching doctors:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleCreate = async (data: CreateDoctorDto) => {
        try {
            await doctorService.create(data);
            setOpenDialog(false);
            fetchDoctors();
        } catch (err) {
            setError('Failed to create doctor');
            console.error('Error creating doctor:', err);
        }
    };

    const handleUpdate = async (data: CreateDoctorDto) => {
        if (!selectedDoctor) return;
        try {
            await doctorService.update(selectedDoctor.user_id, data);
            setOpenDialog(false);
            setSelectedDoctor(null);
            fetchDoctors();
        } catch (err) {
            setError('Failed to update doctor');
            console.error('Error updating doctor:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this doctor?')) return;
        try {
            await doctorService.delete(id);
            fetchDoctors();
        } catch (err) {
            setError('Failed to delete doctor');
            console.error('Error deleting doctor:', err);
        }
    };

    const handleEdit = (doctor: Doctor) => {
        const doctorData: CreateDoctorDto = {
            name: doctor.name || '',
            specialization: doctor.specialization,
            license_number: doctor.license_number,
            years_of_experience: doctor.years_of_experience,
            education: doctor.education,
            certifications: doctor.certifications || undefined,
            languages: doctor.languages
        };
        setSelectedDoctor(doctor);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedDoctor(null);
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2, borderRadius: 3 }} />
                <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 3 }} />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight={700} color="primary.main">Doctor Management</Typography>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ borderRadius: 3, fontWeight: 600 }}
                >
                    Add Doctor
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 4, p: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: 'linear-gradient(90deg, #e3f2fd 0%, #fce4ec 100%)' }}>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Specialization</TableCell>
                            <TableCell>License</TableCell>
                            <TableCell>Experience</TableCell>
                            <TableCell>Education</TableCell>
                            <TableCell>Languages</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {doctors.map((doctor) => (
                            <TableRow key={doctor.id} hover sx={{ transition: 'background 0.2s', '&:hover': { background: 'primary.light', cursor: 'pointer' } }}>
                                <TableCell>
                                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                        <LocalHospitalIcon />
                                    </Avatar>
                                </TableCell>
                                <TableCell>{doctor.name}</TableCell>
                                <TableCell>{doctor.specialization}</TableCell>
                                <TableCell>{doctor.license_number}</TableCell>
                                <TableCell>{doctor.years_of_experience} years</TableCell>
                                <TableCell>{doctor.education}</TableCell>
                                <TableCell>{doctor.languages}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(doctor)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(doctor.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {selectedDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                </DialogTitle>
                <DialogContent sx={{ p: 2, borderRadius: 2 }}>
                    <UserForm
                        type="doctor"
                        initialData={selectedDoctor ? {
                            name: selectedDoctor.name || '',
                            specialization: selectedDoctor.specialization,
                            license_number: selectedDoctor.license_number,
                            years_of_experience: selectedDoctor.years_of_experience,
                            education: selectedDoctor.education,
                            certifications: selectedDoctor.certifications || undefined,
                            languages: selectedDoctor.languages
                        } : undefined}
                        onSubmit={selectedDoctor ? handleUpdate : handleCreate}
                        onCancel={handleCloseDialog}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}; 