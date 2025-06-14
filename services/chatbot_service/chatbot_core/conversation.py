from typing import Dict, List, Optional
from .diagnosis import DiagnosisState

class ConversationState:
    def __init__(self):
        self.diagnosis_state = DiagnosisState()
        self.is_booking = False
        self.booking_step = 'ask_booking'  # ask_booking, select_patient, select_doctor, select_date, select_time, confirm
        self.patient_id = None
        self.doctor_id = None
        self.appointment_date = None
        self.appointment_time = None

class ConversationManager:
    def __init__(self):
        self.conversations: Dict[str, ConversationState] = {}
    
    def get_conversation(self, session_id: str) -> ConversationState:
        """Lấy hoặc tạo mới trạng thái cuộc hội thoại"""
        if session_id not in self.conversations:
            self.conversations[session_id] = ConversationState()
        return self.conversations[session_id]
    
    def reset_conversation(self, session_id: str) -> None:
        """Reset trạng thái cuộc hội thoại"""
        self.conversations[session_id] = ConversationState()
    
    def update_booking_state(self, session_id: str, is_booking: bool) -> None:
        """Cập nhật trạng thái đặt lịch"""
        state = self.get_conversation(session_id)
        state.is_booking = is_booking
        if not is_booking:
            state.booking_step = 'ask_booking'
            state.patient_id = None
            state.doctor_id = None
            state.appointment_date = None
            state.appointment_time = None 