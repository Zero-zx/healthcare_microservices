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
import { Patient, CreatePatientDto } from '../types/user';
import { patientService } from '../services/userService';
import UserForm from '../components/UserForm';
import PersonIcon from '@mui/icons-material/Person';

export const PatientManagement: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await patientService.getAll();
            console.log('Patients Data:', JSON.stringify(data, null, 2));
            setPatients(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch patients');
            console.error('Error fetching patients:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleCreate = async (data: CreatePatientDto) => {
        try {
            await patientService.create(data);
            setOpenDialog(false);
            fetchPatients();
        } catch (err) {
            setError('Failed to create patient');
            console.error('Error creating patient:', err);
        }
    };

    const handleUpdate = async (data: CreatePatientDto) => {
        if (!selectedPatient) return;
        try {
            await patientService.update(selectedPatient.user_id, data);
            setOpenDialog(false);
            setSelectedPatient(null);
            fetchPatients();
        } catch (err) {
            setError('Failed to update patient');
            console.error('Error updating patient:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this patient?')) return;
        try {
            await patientService.delete(id);
            fetchPatients();
        } catch (err) {
            setError('Failed to delete patient');
            console.error('Error deleting patient:', err);
        }
    };

    const handleEdit = (patient: Patient) => {
        setSelectedPatient(patient);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPatient(null);
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
                <Typography variant="h4" fontWeight={700} color="primary.main">Patient Management</Typography>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ borderRadius: 3, fontWeight: 600 }}
                >
                    Add Patient
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 4, p: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: 'linear-gradient(90deg, #e3f2fd 0%, #fce4ec 100%)' }}>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Medical History</TableCell>
                            <TableCell>Patient Type</TableCell>
                            <TableCell>Preferred Contact</TableCell>
                            <TableCell>Timezone</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((patient) => (
                            <TableRow key={patient.user_id} hover sx={{ transition: 'background 0.2s', '&:hover': { background: 'primary.light', cursor: 'pointer' } }}>
                                <TableCell>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <PersonIcon />
                                    </Avatar>
                                </TableCell>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell>{patient.age}</TableCell>
                                <TableCell>{patient.gender}</TableCell>
                                <TableCell>{patient.phone}</TableCell>
                                <TableCell>{patient.address}</TableCell>
                                <TableCell>{patient.medical_history || '-'}</TableCell>
                                <TableCell>{patient.patient_type}</TableCell>
                                <TableCell>{patient.preferred_contact_method || '-'}</TableCell>
                                <TableCell>{patient.timezone || '-'}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(patient)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(patient.user_id)}
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
                    {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
                </DialogTitle>
                <DialogContent sx={{ p: 2, borderRadius: 2 }}>
                    <UserForm
                        type="patient"
                        initialData={selectedPatient ? {
                            name: selectedPatient.name,
                            age: selectedPatient.age,
                            gender: selectedPatient.gender,
                            phone: selectedPatient.phone,
                            address: selectedPatient.address,
                            medical_history: selectedPatient.medical_history || undefined,
                            patient_type: selectedPatient.patient_type,
                            preferred_contact_method: selectedPatient.preferred_contact_method || undefined,
                            timezone: selectedPatient.timezone || undefined
                        } : undefined}
                        onSubmit={selectedPatient ? handleUpdate : handleCreate}
                        onCancel={handleCloseDialog}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}; 