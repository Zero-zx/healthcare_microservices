import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PatientManagement } from './pages/PatientManagement';
import { DoctorManagement } from './pages/DoctorManagement';
import ChatbotPage from './pages/ChatbotPage';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import Appointments from './pages/Appointments';
import Login from './pages/Login';
import Layout from './components/Layout';
import { Avatar } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/patients" element={<PatientManagement />} />
          <Route path="/doctors" element={<DoctorManagement />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
