const GATEWAY_URL = process.env.REACT_APP_GATEWAY_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: `${GATEWAY_URL}/api/users/login/`,
        REGISTER: `${GATEWAY_URL}/api/users/register/`,
        REFRESH: `${GATEWAY_URL}/api/users/token/refresh/`,
    },
    // User endpoints
    USERS: {
        BASE: `${GATEWAY_URL}/api/users/`,
        PROFILE: `${GATEWAY_URL}/api/users/profile/`,
    },
    // Doctor endpoints
    DOCTORS: {
        BASE: `${GATEWAY_URL}/api/doctors/`,
    },
    // Patient endpoints
    PATIENTS: {
        BASE: `${GATEWAY_URL}/api/patients/`,
    },
    // Appointment endpoints
    APPOINTMENTS: {
        BASE: `${GATEWAY_URL}/api/appointments/`,
    },
    // Laboratory endpoints
    LABORATORY: {
        BASE: `${GATEWAY_URL}/api/laboratory/`,
        PREDICT: `${GATEWAY_URL}/api/predict/`,
    },
    // Chatbot endpoints
    CHATBOT: {
        BASE: `${GATEWAY_URL}/api/chatbot/chat/`,
    },
}; 