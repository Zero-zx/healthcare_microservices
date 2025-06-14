import json
import os
from typing import Dict, Set, List, Tuple, Optional

# Đường dẫn tới file KB
KB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'kb', 'diseases.json')

# Load knowledge base
with open(KB_PATH, encoding='utf-8') as f:
    KB = json.load(f)

# Tập hợp tất cả các triệu chứng
ALL_SYMPTOMS = set()
for disease in KB.values():
    ALL_SYMPTOMS.update(disease['symptoms'])

class DiagnosisState:
    def __init__(self):
        self.current_disease: Optional[str] = None
        self.asked_symptoms: Set[str] = set()
        self.confirmed_symptoms: Set[str] = set()
        self.disease_probabilities: Dict[str, float] = {}
        self.step: str = 'initial'  # initial, asking_symptoms, diagnosis
        self.current_symptom: Optional[str] = None

def process_initial_symptoms(user_text: str) -> Set[str]:
    """Xử lý câu trả lời đầu tiên của user về triệu chứng"""
    words = user_text.lower().split()
    found_symptoms = set()
    for word in words:
        for symptom in ALL_SYMPTOMS:
            if word in symptom or symptom in word:
                found_symptoms.add(symptom)
    return found_symptoms

def calculate_disease_probability(disease: str, confirmed_symptoms: Set[str]) -> float:
    """Tính xác suất bệnh dựa trên các triệu chứng đã xác nhận"""
    disease_symptoms = set(KB[disease]['symptoms'])
    if not disease_symptoms:
        return 0
    matching_symptoms = len(confirmed_symptoms.intersection(disease_symptoms))
    return (matching_symptoms / len(disease_symptoms)) * 100

def get_next_symptom_to_ask(disease: str, asked_symptoms: Set[str]) -> Optional[str]:
    """Chọn triệu chứng tiếp theo cần hỏi (chỉ loại bỏ các triệu chứng đã hỏi, không loại bỏ các triệu chứng đã xác nhận)"""
    disease_symptoms = set(KB[disease]['symptoms'])
    remaining_symptoms = disease_symptoms - asked_symptoms
    if not remaining_symptoms:
        return None
    # Ưu tiên các triệu chứng phổ biến hơn
    return max(remaining_symptoms, key=lambda s: len([d for d in KB.values() if s in d['symptoms']]))

def get_diagnosis_response(state: DiagnosisState) -> Tuple[str, bool]:
    """Tạo câu trả lời dựa trên trạng thái hiện tại"""
    if state.step == 'initial':
        return "Bạn có thể mô tả các triệu chứng của mình không?", False
    
    # Nếu user đã xác nhận tất cả triệu chứng của một bệnh, trả về bệnh đó luôn
    for disease, info in KB.items():
        disease_symptoms = set(info['symptoms'])
        if disease_symptoms and disease_symptoms.issubset(state.confirmed_symptoms):
            response = f"Dựa trên các triệu chứng, bạn có thể bị {info['name']}.\n"
            response += f"Triệu chứng: {', '.join(info['symptoms'])}\n"
            response += f"Điều trị: {info['treatment']}"
            if 'description' in info:
                response += f"\n\nMô tả: {info['description']}"
            return response, True
    
    # Kiểm tra nếu có bệnh nào > 70%
    max_prob_disease = max(state.disease_probabilities.items(), key=lambda x: x[1])
    if max_prob_disease[1] > 50:
        disease_info = KB[max_prob_disease[0]]
        response = f"Dựa trên các triệu chứng, bạn có thể bị {disease_info['name']}.\n"
        response += f"Triệu chứng: {', '.join(disease_info['symptoms'])}\n"
        response += f"Điều trị: {disease_info['treatment']}"
        if 'description' in disease_info:
            response += f"\n\nMô tả: {disease_info['description']}"
        return response, True
    
    # Nếu chưa đủ, chọn triệu chứng tiếp theo
    next_symptom = get_next_symptom_to_ask(state.current_disease, state.asked_symptoms)
    if next_symptom:
        state.current_symptom = next_symptom
        state.asked_symptoms.add(next_symptom)
        return f"Bạn có bị {next_symptom} không?", False
    
    # Nếu đã hỏi hết triệu chứng của bệnh hiện tại
    # Kiểm tra lại nếu user đã xác nhận hết triệu chứng của bệnh hiện tại thì trả về bệnh đó
    if state.current_disease:
        disease_symptoms = set(KB[state.current_disease]['symptoms'])
        if disease_symptoms and disease_symptoms.issubset(state.confirmed_symptoms):
            info = KB[state.current_disease]
            response = f"Dựa trên các triệu chứng, bạn có thể bị {info['name']}.\n"
            response += f"Triệu chứng: {', '.join(info['symptoms'])}\n"
            response += f"Điều trị: {info['treatment']}"
            if 'description' in info:
                response += f"\n\nMô tả: {info['description']}"
            return response, True
    state.step = 'initial'
    return "Bạn có thể mô tả thêm các triệu chứng khác không?", False

def update_diagnosis_state(state: DiagnosisState, user_message: str) -> None:
    """Cập nhật trạng thái chẩn đoán dựa trên câu trả lời của user"""
    if state.step == 'initial':
        # Xử lý câu trả lời đầu tiên
        found_symptoms = process_initial_symptoms(user_message)
        if found_symptoms:
            state.confirmed_symptoms.update(found_symptoms)
            state.step = 'asking_symptoms'
            # Tính xác suất cho tất cả bệnh
            for disease in KB:
                prob = calculate_disease_probability(disease, state.confirmed_symptoms)
                state.disease_probabilities[disease] = prob
            
            # Chọn bệnh có xác suất cao nhất để hỏi thêm
            max_prob_disease = max(state.disease_probabilities.items(), key=lambda x: x[1])
            state.current_disease = max_prob_disease[0]
    
    elif state.step == 'asking_symptoms':
        # Xử lý câu trả lời yes/no
        if user_message.lower() in ['có', 'vâng', 'đúng', 'yes', 'y']:
            if state.current_symptom:
                state.confirmed_symptoms.add(state.current_symptom)
                # Cập nhật xác suất
                for disease in KB:
                    prob = calculate_disease_probability(disease, state.confirmed_symptoms)
                    state.disease_probabilities[disease] = prob 