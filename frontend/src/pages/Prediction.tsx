import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  MenuItem
} from '@mui/material';
import axios from 'axios';

const validationSchema = Yup.object({
  patient_id: Yup.string().required('Required'),
  age: Yup.number().required('Required').min(0, 'Age must be positive'),
  gender: Yup.string().required('Required'),
});

const Prediction: React.FC = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [prediction, setPrediction] = React.useState<string | null>(null);
  const [symptoms, setSymptoms] = React.useState({
    fever: false,
    cough: false,
    fatigue: false,
    headache: false,
    soreThroat: false,
    runnyNose: false,
    bodyAche: false,
    nausea: false,
    vomiting: false,
    diarrhea: false,
    shortnessBreath: false,
    chestPain: false,
    rash: false,
    jointPain: false,
  });

  const formik = useFormik({
    initialValues: {
      patient_id: '',
      age: '',
      gender: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:8007/api/predict/',
          {
            ...values,
            symptoms,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          setPrediction(response.data.predicted_disease);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to get prediction');
      }
    },
  });

  const handleSymptomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSymptoms({
      ...symptoms,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Disease Prediction
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {prediction && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Predicted condition: {prediction}
            </Alert>
          )}
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="patient_id"
              name="patient_id"
              label="Patient ID"
              value={formik.values.patient_id}
              onChange={formik.handleChange}
              error={formik.touched.patient_id && Boolean(formik.errors.patient_id)}
              helperText={formik.touched.patient_id && formik.errors.patient_id}
              margin="normal"
            />
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
              margin="normal"
            />
            <TextField
              select
              fullWidth
              id="gender"
              name="gender"
              label="Gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              error={formik.touched.gender && Boolean(formik.errors.gender)}
              helperText={formik.touched.gender && formik.errors.gender}
              margin="normal"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </TextField>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Symptoms
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {Object.entries(symptoms).map(([key, value]) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={value}
                      onChange={handleSymptomChange}
                      name={key}
                    />
                  }
                  label={key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}
                />
              ))}
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              Get Prediction
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Prediction; 