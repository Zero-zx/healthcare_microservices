import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Appointments from './pages/Appointments';
import PatientManagement from './pages/PatientManagement';
import DoctorManagement from './pages/DoctorManagement';
import ChatbotPage from './pages/ChatbotPage';
import Prediction from './pages/Prediction';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/login" element={<Layout><Login /></Layout>} />
                <Route path="/appointments" element={<Layout><Appointments /></Layout>} />
                <Route path="/patients" element={<Layout><PatientManagement /></Layout>} />
                <Route path="/doctors" element={<Layout><DoctorManagement /></Layout>} />
                <Route path="/chatbot" element={<Layout><ChatbotPage /></Layout>} />
                <Route path="/prediction" element={<Layout><Prediction /></Layout>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
