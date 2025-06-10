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
    initialData?: Partial<T>;
    onSubmit: (data: T) => Promise<void>;
    onCancel: () => void;
}

const UserForm = <T extends CreatePatientDto | CreateDoctorDto>({
    type,
    initialData,
    onSubmit,
    onCancel,
}: UserFormProps<T>) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries()) as unknown as T;
        onSubmit(data);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={2}>
                <TextField
                    required
                    fullWidth
                    name="name"
                    label="Name"
                    defaultValue={initialData?.name}
                />
                {type === 'doctor' && (
                    <>
                        <TextField
                            required
                            fullWidth
                            name="specialization"
                            label="Specialization"
                            defaultValue={(initialData as Partial<CreateDoctorDto>)?.specialization}
                        />
                        <TextField
                            required
                            fullWidth
                            name="license_number"
                            label="License Number"
                            defaultValue={(initialData as Partial<CreateDoctorDto>)?.license_number}
                        />
                        <TextField
                            required
                            fullWidth
                            type="number"
                            name="years_of_experience"
                            label="Years of Experience"
                            defaultValue={(initialData as Partial<CreateDoctorDto>)?.years_of_experience}
                        />
                        <TextField
                            required
                            fullWidth
                            name="education"
                            label="Education"
                            defaultValue={(initialData as Partial<CreateDoctorDto>)?.education}
                        />
                        <TextField
                            required
                            fullWidth
                            name="languages"
                            label="Languages"
                            defaultValue={(initialData as Partial<CreateDoctorDto>)?.languages}
                        />
                    </>
                )}

                {type === 'patient' && (
                    <>
                        <TextField
                            required
                            fullWidth
                            name="age"
                            label="Age"
                            type="number"
                            defaultValue={(initialData as Partial<CreatePatientDto>)?.age}
                        />
                        <TextField
                            required
                            fullWidth
                            select
                            name="gender"
                            label="Gender"
                            defaultValue={(initialData as Partial<CreatePatientDto>)?.gender || 'other'}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </TextField>
                        <TextField
                            required
                            fullWidth
                            name="address"
                            label="Address"
                            multiline
                            rows={2}
                            defaultValue={(initialData as Partial<CreatePatientDto>)?.address}
                        />
                        <TextField
                            fullWidth
                            name="medical_history"
                            label="Medical History"
                            multiline
                            rows={3}
                            defaultValue={(initialData as Partial<CreatePatientDto>)?.medical_history}
                        />
                        <TextField
                            required
                            fullWidth
                            select
                            name="patient_type"
                            label="Patient Type"
                            defaultValue={(initialData as Partial<CreatePatientDto>)?.patient_type || 'current'}
                        >
                            <MenuItem value="current">Current Patient</MenuItem>
                            <MenuItem value="remote">Remote Patient</MenuItem>
                            <MenuItem value="emergency">Emergency Patient</MenuItem>
                            <MenuItem value="referral">Referred Patient</MenuItem>
                            <MenuItem value="chronic">Chronic Care Patient</MenuItem>
                            <MenuItem value="preventive">Preventive Care Patient</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            select
                            name="preferred_contact_method"
                            label="Preferred Contact Method"
                            defaultValue={(initialData as Partial<CreatePatientDto>)?.preferred_contact_method || 'phone'}
                        >
                            <MenuItem value="phone">Phone</MenuItem>
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="video">Video Call</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            name="timezone"
                            label="Timezone"
                            defaultValue={(initialData as Partial<CreatePatientDto>)?.timezone}
                        />
                    </>
                )}

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {initialData ? 'Update' : 'Create'}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default UserForm; 