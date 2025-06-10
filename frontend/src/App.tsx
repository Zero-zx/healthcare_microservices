import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Layout from './components/Layout';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import Home from './pages/Home';
import Appointments from './pages/Appointments';
import { PatientManagement } from './pages/PatientManagement';
import { DoctorManagement } from './pages/DoctorManagement';
import Chatbot from './pages/Chatbot';
import Prediction from './pages/Prediction';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route 
                    path="/login" 
                    element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
                />
                <Route 
                    path="/register" 
                    element={isAuthenticated ? <Navigate to="/" /> : <Register />} 
                />

                {/* Protected routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/appointments"
                    element={
                        <ProtectedRoute>
                            <Appointments />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/patients"
                    element={
                        <ProtectedRoute>
                            <PatientManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/doctors"
                    element={
                        <ProtectedRoute>
                            <DoctorManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/chatbot"
                    element={
                        <ProtectedRoute>
                            <Chatbot />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/prediction"
                    element={
                        <ProtectedRoute>
                            <Prediction />
                        </ProtectedRoute>
                    }
                />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
