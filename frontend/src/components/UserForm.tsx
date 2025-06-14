import React from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    SelectChangeEvent
} from '@mui/material';
import { CreateUserDto, CreatePatientDto, CreateDoctorDto } from '../types/user';

interface UserFormProps<T> {
    type: 'user' | 'patient' | 'doctor';
    initialData?: Partial<T>;
    onSubmit: (data: T) => void;
    onCancel: () => void;
}

type FormData = Partial<CreateUserDto & {
    specialization?: string;
    patient_type?: 'normal' | 'remote' | 'VIP';
}>;

const UserForm = <T extends CreateUserDto | CreatePatientDto | CreateDoctorDto>({
    type,
    initialData,
    onSubmit,
    onCancel
}: UserFormProps<T>) => {
    const [formData, setFormData] = React.useState<FormData>(initialData || {});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name as string]: value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData as T);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        required
                        name="email"
                        label="Email"
                        type="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        required
                        name="first_name"
                        label="First Name"
                        value={formData.first_name || ''}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        required
                        name="last_name"
                        label="Last Name"
                        value={formData.last_name || ''}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        required
                        name="phone_number"
                        label="Phone Number"
                        value={formData.phone_number || ''}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        name="address"
                        label="Address"
                        multiline
                        rows={3}
                        value={formData.address || ''}
                        onChange={handleChange}
                    />
                </Grid>

                {type === 'doctor' && (
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            name="specialization"
                            label="Specialization"
                            value={formData.specialization || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                )}

                {type === 'patient' && (
                    <Grid item xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel>Patient Type</InputLabel>
                            <Select
                                name="patient_type"
                                value={formData.patient_type || 'normal'}
                                onChange={handleSelectChange}
                                label="Patient Type"
                            >
                                <MenuItem value="normal">Normal</MenuItem>
                                <MenuItem value="remote">Remote</MenuItem>
                                <MenuItem value="VIP">VIP</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                )}
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                    {initialData ? 'Update' : 'Create'}
                </Button>
            </Box>
        </Box>
    );
};

export default UserForm; 