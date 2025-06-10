import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Container,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { setCredentials, setLoading, setError } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { RegisterRequest } from '../../types/auth';

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Enter a valid email')
        .required('Email is required'),
    username: Yup.string()
        .min(3, 'Username should be of minimum 3 characters length')
        .required('Username is required'),
    password: Yup.string()
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
    password2: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    role: Yup.string()
        .oneOf(['patient', 'doctor'], 'Please select a valid role')
        .required('Role is required'),
    // Patient-specific validations
    name: Yup.string().when('role', {
        is: (val: string) => val === 'patient',
        then: () => Yup.string().required('Name is required')
    }),
    age: Yup.number().when('role', {
        is: (val: string) => val === 'patient',
        then: () => Yup.number()
            .min(0, 'Age must be positive')
            .max(120, 'Age must be less than 120')
            .required('Age is required')
    }),
    gender: Yup.string().when('role', {
        is: (val: string) => val === 'patient',
        then: () => Yup.string()
            .oneOf(['male', 'female', 'other'], 'Please select a valid gender')
            .required('Gender is required')
    }),
    phone: Yup.string().when('role', {
        is: (val: string) => val === 'patient',
        then: () => Yup.string().required('Phone number is required')
    }),
    address: Yup.string().when('role', {
        is: (val: string) => val === 'patient',
        then: () => Yup.string().required('Address is required')
    }),
    // Doctor-specific validations
    specialization: Yup.string().when('role', {
        is: (val: string) => val === 'doctor',
        then: () => Yup.string().required('Specialization is required')
    }),
    license_number: Yup.string().when('role', {
        is: (val: string) => val === 'doctor',
        then: () => Yup.string().required('License number is required')
    }),
    years_of_experience: Yup.number().when('role', {
        is: (val: string) => val === 'doctor',
        then: () => Yup.number()
            .min(0, 'Years of experience must be positive')
            .required('Years of experience is required')
    })
});

export const Register: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const [role, setRole] = useState<'patient' | 'doctor'>('patient');

    const formik = useFormik<RegisterRequest>({
        initialValues: {
            email: '',
            username: '',
            password: '',
            password2: '',
            role: 'patient',
            // Patient-specific fields
            name: '',
            age: undefined,
            gender: undefined,
            phone: '',
            address: '',
            // Doctor-specific fields
            specialization: '',
            license_number: '',
            years_of_experience: undefined
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                dispatch(setLoading(true));
                const response = await authService.register(values);
                dispatch(setCredentials(response));
                navigate('/dashboard');
            } catch (err: any) {
                dispatch(setError(err.response?.data?.error || 'Registration failed'));
            } finally {
                dispatch(setLoading(false));
            }
        }
    });

    return (
        <Container component="main" maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Sign Up
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            {/* Common fields */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="username"
                                    name="username"
                                    label="Username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username && formik.errors.username}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="password2"
                                    name="password2"
                                    label="Confirm Password"
                                    type="password"
                                    value={formik.values.password2}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password2 && Boolean(formik.errors.password2)}
                                    helperText={formik.touched.password2 && formik.errors.password2}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="role-label">Role</InputLabel>
                                    <Select
                                        labelId="role-label"
                                        id="role"
                                        name="role"
                                        value={formik.values.role}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            setRole(e.target.value as 'patient' | 'doctor');
                                        }}
                                        error={formik.touched.role && Boolean(formik.errors.role)}
                                        label="Role"
                                    >
                                        <MenuItem value="patient">Patient</MenuItem>
                                        <MenuItem value="doctor">Doctor</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Role-specific fields */}
                            {role === 'patient' ? (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="name"
                                            name="name"
                                            label="Full Name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            helperText={formik.touched.name && formik.errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            id="age"
                                            name="age"
                                            label="Age"
                                            type="number"
                                            value={formik.values.age}
                                            onChange={formik.handleChange}
                                            error={formik.touched.age && Boolean(formik.errors.age)}
                                            helperText={formik.touched.age && formik.errors.age}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="gender-label">Gender</InputLabel>
                                            <Select
                                                labelId="gender-label"
                                                id="gender"
                                                name="gender"
                                                value={formik.values.gender}
                                                onChange={formik.handleChange}
                                                error={formik.touched.gender && Boolean(formik.errors.gender)}
                                                label="Gender"
                                            >
                                                <MenuItem value="male">Male</MenuItem>
                                                <MenuItem value="female">Female</MenuItem>
                                                <MenuItem value="other">Other</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="phone"
                                            name="phone"
                                            label="Phone Number"
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                                            helperText={formik.touched.phone && formik.errors.phone}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="address"
                                            name="address"
                                            label="Address"
                                            multiline
                                            rows={2}
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            error={formik.touched.address && Boolean(formik.errors.address)}
                                            helperText={formik.touched.address && formik.errors.address}
                                        />
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="specialization"
                                            name="specialization"
                                            label="Specialization"
                                            value={formik.values.specialization}
                                            onChange={formik.handleChange}
                                            error={formik.touched.specialization && Boolean(formik.errors.specialization)}
                                            helperText={formik.touched.specialization && formik.errors.specialization}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="license_number"
                                            name="license_number"
                                            label="License Number"
                                            value={formik.values.license_number}
                                            onChange={formik.handleChange}
                                            error={formik.touched.license_number && Boolean(formik.errors.license_number)}
                                            helperText={formik.touched.license_number && formik.errors.license_number}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="years_of_experience"
                                            name="years_of_experience"
                                            label="Years of Experience"
                                            type="number"
                                            value={formik.values.years_of_experience}
                                            onChange={formik.handleChange}
                                            error={formik.touched.years_of_experience && Boolean(formik.errors.years_of_experience)}
                                            helperText={formik.touched.years_of_experience && formik.errors.years_of_experience}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => navigate('/login')}
                        >
                            Already have an account? Sign In
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}; 