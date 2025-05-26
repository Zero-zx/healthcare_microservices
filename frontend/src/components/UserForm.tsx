import React from 'react';
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Stack,
    Typography,
} from '@mui/material';
import { Patient, Doctor, CreatePatientDto, CreateDoctorDto } from '../types/user';

interface UserFormProps<T extends CreatePatientDto | CreateDoctorDto> {
    type: 'patient' | 'doctor';
    initialData?: Partial<Patient | Doctor>;
    onSubmit: (data: T) => Promise<void>;
    onCancel: () => void;
}

export const UserForm = <T extends CreatePatientDto | CreateDoctorDto>({
    type,
    initialData,
    onSubmit,
    onCancel,
}: UserFormProps<T>) => {
    const [formData, setFormData] = React.useState<T>(() => {
        if (type === 'patient') {
            const patientData = initialData as Patient;
            return {
                name: patientData?.name || '',
                age: patientData?.age || 0,
                gender: patientData?.gender || 'male',
                phone: patientData?.phone || '',
                email: patientData?.email || '',
                address: patientData?.address || '',
                medical_history: patientData?.medical_history || '',
            } as unknown as T;
        } else {
            const doctorData = initialData as Doctor;
            return {
                name: doctorData?.name || '',
                specialty: doctorData?.specialty || '',
                license: doctorData?.license || '',
                phone: doctorData?.phone || '',
                email: doctorData?.email || '',
            } as unknown as T;
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, p: 2, borderRadius: 1 }}>
            <Stack spacing={2}>
                {type === 'patient' ? (
                    <>
                        <TextField
                            required
                            fullWidth
                            label="Name"
                            name="name"
                            value={(formData as CreatePatientDto).name}
                            onChange={handleChange}
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField
                                required
                                fullWidth
                                label="Age"
                                name="age"
                                type="number"
                                value={(formData as CreatePatientDto).age}
                                onChange={handleChange}
                            />
                            <TextField
                                required
                                fullWidth
                                select
                                label="Gender"
                                name="gender"
                                value={(formData as CreatePatientDto).gender}
                                onChange={handleChange}
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </TextField>
                        </Stack>
                        <TextField
                            required
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={(formData as CreatePatientDto).phone}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={(formData as CreatePatientDto).email}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Address"
                            name="address"
                            value={(formData as CreatePatientDto).address}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Medical History"
                            name="medical_history"
                            multiline
                            rows={4}
                            value={(formData as CreatePatientDto).medical_history}
                            onChange={handleChange}
                        />
                    </>
                ) : (
                    <>
                        <TextField
                            required
                            fullWidth
                            label="Name"
                            name="name"
                            value={(formData as CreateDoctorDto).name}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={(formData as CreateDoctorDto).email}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={(formData as CreateDoctorDto).phone}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Specialty"
                            name="specialty"
                            value={(formData as CreateDoctorDto).specialty}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            fullWidth
                            label="License"
                            name="license"
                            value={(formData as CreateDoctorDto).license}
                            onChange={handleChange}
                        />
                    </>
                )}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {initialData ? 'Update' : 'Create'}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}; 