import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ChatIcon from '@mui/icons-material/Chat';

const features = [
  {
    title: 'Appointments',
    desc: 'Manage your appointments and schedule new ones.',
    icon: <CalendarMonthIcon fontSize="large" color="primary" />,
    btn: 'Book Now',
    to: '/appointments',
  },
  {
    title: 'Medical Records',
    desc: 'Access and update your medical records.',
    icon: <AssignmentIcon fontSize="large" color="secondary" />,
    btn: 'View Records',
    to: '/records',
    disabled: true,
  },
  {
    title: 'Health Predictions',
    desc: 'Get AI-powered health predictions and insights.',
    icon: <QueryStatsIcon fontSize="large" color="success" />,
    btn: 'Check Symptoms',
    to: '/prediction',
  },
  {
    title: 'Healthcare Assistant',
    desc: 'Chat with our AI assistant for medical advice and information.',
    icon: <ChatIcon fontSize="large" color="info" />,
    btn: 'Start Chat',
    to: '/chatbot',
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 6, mb: 4, textAlign: 'center' }}>
        <Avatar
          src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
          sx={{ width: 96, height: 96, mx: 'auto', mb: 2, boxShadow: 3 }}
        />
        <Typography variant="h2" fontWeight={700} color="primary.main" gutterBottom>
          Welcome to Healthcare Portal
        </Typography>
        <Typography variant="h5" color="text.secondary" mb={4}>
          Smart, modern, and friendly healthcare management for everyone
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map((f, idx) => (
            <Grid item xs={12} sm={6} md={3} key={f.title}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 4,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.03)',
                    boxShadow: 8,
                  },
                  opacity: f.disabled ? 0.5 : 1,
                  cursor: f.disabled ? 'not-allowed' : 'pointer',
                }}
                onClick={() => !f.disabled && navigate(f.to)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {f.icon}
                </Box>
                <CardContent sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {f.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={2}>
                    {f.desc}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={f.disabled}
                    sx={{ fontWeight: 600, borderRadius: 2 }}
                  >
                    {f.btn}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 