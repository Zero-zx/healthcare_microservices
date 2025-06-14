import os
import json
import requests
from datetime import datetime, date
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from collections import Counter
from chatbot_core.conversation import ConversationManager
from chatbot_core.diagnosis import update_diagnosis_state, get_diagnosis_response

# External service URLs - based on docker-compose.yml
DOCTOR_SERVICE_URL = "http://doctor_service:8000/api/doctors/"
PATIENT_SERVICE_URL = "http://patient_service:8000/api/patients/"
APPOINTMENT_SERVICE_URL = "http://appointment_service:8000/api/appointments/"

# Đường dẫn tuyệt đối tới file KB
KB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'kb', 'diseases.json')

with open(KB_PATH, encoding='utf-8') as f:
    KB = json.load(f)

ALL_SYMPTOMS = set()
for disease in KB.values():
    ALL_SYMPTOMS.update(disease['symptoms'])

# Khởi tạo conversation manager
conversation_manager = ConversationManager()

# Appointment booking helper functions (mocked to disable booking)
def get_doctors_list():
    return []

def get_patients_list():
    return []

def create_appointment(appointment_data):
    return None, 'Đặt lịch không khả dụng.'

def parse_appointment_state(history):
    """Phân tích trạng thái đặt lịch từ history"""
    state = {
        'is_booking': False,
        'patient_id': None,
        'doctor_id': None,
        'date': None,
        'time': None,
        'service_type': 'general',
        'duration': 30,
        'step': 'ask_booking'  # ask_booking, select_patient, select_doctor, select_date, select_time, confirm
    }

    booking_confirmed = False
    ask_booking_msg_index = -1

    # Tìm xem user đã đồng ý đặt lịch chưa
    for i, msg in enumerate(history):
        if msg['sender'] == 'bot' and 'đặt lịch hẹn khám không?' in msg['text']:
            ask_booking_msg_index = i
        elif msg['sender'] == 'user' and msg.get('answer') == 'có' and ask_booking_msg_index != -1 and i == ask_booking_msg_index + 1:
            # User trả lời "Có" ngay sau câu hỏi đặt lịch của bot
            # Và câu hỏi đặt lịch không phải là câu hỏi triệu chứng
            bot_question_text = history[ask_booking_msg_index]['text']
            if 'Bạn có bị ' not in bot_question_text:
                 booking_confirmed = True
                 state['is_booking'] = True
                 state['step'] = 'select_patient' # Bắt đầu chọn bệnh nhân
                 break # Đã xác nhận đặt lịch, không cần check thêm câu trả lời "có" nữa
        elif msg['sender'] == 'user' and msg.get('answer') == 'không' and ask_booking_msg_index != -1 and i == ask_booking_msg_index + 1:
            # User trả lời "Không" ngay sau câu hỏi đặt lịch của bot
            bot_question_text = history[ask_booking_msg_index]['text']
            if 'Bạn có bị ' not in bot_question_text:
                state['is_booking'] = False
                state['step'] = 'ask_booking' # Reset về trạng thái ban đầu
                # Không break ở đây, vì có thể user từ chối rồi lại đồng ý sau đó trong history (ít khả năng)
    
    if not state['is_booking']:
        # Nếu chưa xác nhận đặt lịch, thì không phân tích các bước tiếp theo
        return state

    # Nếu đã xác nhận đặt lịch, tiếp tục phân tích các bước
    current_step_processed = False
    for i, msg in enumerate(history):
        if not state['is_booking']: # Có thể user từ chối ở giữa chừng
            break

        if msg['sender'] == 'bot':
            if state['step'] == 'select_patient' and 'Bạn là bệnh nhân nào?' in msg['text']:
                current_step_processed = False
            elif state['step'] == 'select_doctor' and 'Bạn muốn đặt lịch với bác sĩ nào?' in msg['text']:
                current_step_processed = False
            elif state['step'] == 'select_date' and 'Bạn muốn khám ngày nào?' in msg['text']:
                current_step_processed = False
            elif state['step'] == 'select_time' and 'Bạn muốn khám lúc mấy giờ?' in msg['text']:
                current_step_processed = False
        
        elif msg['sender'] == 'user' and not msg.get('answer') and not current_step_processed:
            if state['step'] == 'select_patient':
                try:
                    selection = int(msg['text'].strip())
                    patients = get_patients_list()
                    if 1 <= selection <= len(patients):
                        state['patient_id'] = patients[selection - 1]['user_id']
                        state['step'] = 'select_doctor'
                        current_step_processed = True
                except:
                    pass # Lỗi nhập liệu, giữ nguyên step, bot sẽ hỏi lại
            elif state['step'] == 'select_doctor':
                try:
                    selection = int(msg['text'].strip())
                    doctors = get_doctors_list()
                    if 1 <= selection <= len(doctors):
                        state['doctor_id'] = doctors[selection - 1]['user_id']
                        state['step'] = 'select_date'
                        current_step_processed = True
                except:
                    pass
            elif state['step'] == 'select_date':
                try:
                    date_str = msg['text'].strip()
                    parsed_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                    if parsed_date > date.today():
                        state['date'] = parsed_date.strftime('%Y-%m-%d')
                        state['step'] = 'select_time'
                        current_step_processed = True
                except:
                    pass
            elif state['step'] == 'select_time':
                try:
                    time_str = msg['text'].strip()
                    parsed_time = datetime.strptime(time_str, '%H:%M').time()
                    state['time'] = parsed_time.strftime('%H:%M:%S')
                    state['step'] = 'confirm' # Chuyển sang xác nhận hoặc tạo lịch
                    current_step_processed = True
                except:
                    pass
    return state

def handle_appointment_booking(history):
    """Xử lý quy trình đặt lịch hẹn"""
    if not history:
        return None
    
    last_msg = history[-1]
    state = parse_appointment_state(history) # state giờ đã chính xác hơn
    
    # Nếu user từ chối đặt lịch (ngay sau câu hỏi đặt lịch)
    if last_msg.get('answer') == 'không' and len(history) >=2:
        bot_question = history[-2]
        if bot_question.get('sender') == 'bot' and \
           'đặt lịch hẹn khám không?' in bot_question.get('text', '') and \
           'Bạn có bị ' not in bot_question.get('text', ''):
            return "Cảm ơn bạn đã sử dụng dịch vụ. Chúc bạn sớm khỏe lại!"
    
    # Ưu tiên xử lý nếu state cho thấy đang bắt đầu đặt lịch (chọn bệnh nhân)
    # Hoặc nếu đang ở bước chọn bệnh nhân và lựa chọn trước đó không hợp lệ (patient_id is None)
    if state['is_booking'] and state['step'] == 'select_patient' and state['patient_id'] is None:
        # Điều kiện này được kích hoạt khi:
        # 1. User vừa trả lời "Có" cho câu hỏi "Bạn có muốn đặt lịch hẹn khám không?"
        #    (parse_appointment_state đã set is_booking=True, step='select_patient').
        # 2. User đã ở bước chọn bệnh nhân nhưng nhập liệu không hợp lệ ở lần trước.

        patients = get_patients_list()
        if not patients:
            return "Xin lỗi, hiện tại không thể kết nối đến hệ thống bệnh nhân. Vui lòng thử lại sau."
        
        patient_list_str = "\n".join([f"{i+1}. {p['name']} (ID: {p['user_id']})" for i, p in enumerate(patients[:10])])
        
        # Kiểm tra xem có phải user vừa nhập sai ở bước chọn bệnh nhân không
        prefix = ""
        # Nếu tin nhắn cuối từ user, không phải là câu trả lời có/không (tức là user đã nhập text)
        # và trước đó bot đã hỏi "Bạn là bệnh nhân nào?" (cho thấy đang ở bước chọn bệnh nhân)
        if last_msg['sender'] == 'user' and not last_msg.get('answer'):
            # Tìm câu hỏi "Bạn là bệnh nhân nào?" gần nhất của bot
            asked_for_patient = False
            for i in range(len(history) - 2, -1, -1): # Lùi từ tin nhắn trước last_msg
                if history[i]['sender'] == 'bot' and 'Bạn là bệnh nhân nào?' in history[i]['text']:
                    asked_for_patient = True
                    break
            if asked_for_patient: # Chỉ thêm prefix nếu user nhập sai sau khi đã được hỏi
                 prefix = "Lựa chọn không hợp lệ. "

        return f"{prefix}Bạn là bệnh nhân nào? Vui lòng chọn số thứ tự:\n{patient_list_str}"

    # Xử lý các bước tiếp theo chỉ khi state['is_booking'] là True và user nhập text
    if state['is_booking'] and last_msg['sender'] == 'user' and not last_msg.get('answer'):
        # Lưu ý: parse_appointment_state đã cập nhật state['step'] nếu user nhập đúng ở bước trước.
        # Nên ở đây, chúng ta sẽ dựa vào state['step'] mới nhất.

        if state['step'] == 'select_doctor' and state['doctor_id'] is None: # Cần chọn bác sĩ
            # parse_appointment_state đã xác nhận patient_id ở bước trước
            doctors = get_doctors_list()
            if not doctors:
                return "Xin lỗi, hiện tại không thể kết nối đến hệ thống bác sĩ. Vui lòng thử lại sau."
            doctor_list_str = "\n".join([f"{i+1}. Bác sĩ {d['name']} - {d.get('specialty', 'Chưa xác định')}" for i, d in enumerate(doctors[:10])])
            
            prefix = ""
            if last_msg['sender'] == 'user' and not last_msg.get('answer'):
                asked_for_doctor = False
                for i in range(len(history) - 2, -1, -1):
                    if history[i]['sender'] == 'bot' and 'Bạn muốn đặt lịch với bác sĩ nào?' in history[i]['text']:
                        asked_for_doctor = True
                        break
                if asked_for_doctor:
                    prefix = "Lựa chọn không hợp lệ. "
            return f"{prefix}Bạn muốn đặt lịch với bác sĩ nào? Vui lòng chọn số thứ tự:\n{doctor_list_str}"
        
        elif state['step'] == 'select_date' and state['date'] is None: # Cần chọn ngày
            # parse_appointment_state đã xác nhận doctor_id
            prefix = ""
            if last_msg['sender'] == 'user' and not last_msg.get('answer'):
                asked_for_date = False
                for i in range(len(history) - 2, -1, -1):
                    if history[i]['sender'] == 'bot' and 'Bạn muốn khám ngày nào?' in history[i]['text']:
                        asked_for_date = True
                        break
                if asked_for_date: # Chỉ thêm prefix nếu user nhập sai sau khi đã được hỏi
                     prefix = "Định dạng ngày không đúng hoặc ngày không hợp lệ. "
            return f"{prefix}Bạn muốn khám ngày nào? (Định dạng: YYYY-MM-DD, ví dụ: 2024-06-01)"

        elif state['step'] == 'select_time' and state['time'] is None: # Cần chọn giờ
            # parse_appointment_state đã xác nhận date
            prefix = ""
            if last_msg['sender'] == 'user' and not last_msg.get('answer'):
                asked_for_time = False
                for i in range(len(history) - 2, -1, -1):
                    if history[i]['sender'] == 'bot' and 'Bạn muốn khám lúc mấy giờ?' in history[i]['text']:
                        asked_for_time = True
                        break
                if asked_for_time:
                    prefix = "Định dạng giờ không đúng. "
            return f"{prefix}Bạn muốn khám lúc mấy giờ? (Định dạng: HH:MM, ví dụ: 14:30)"
        
        elif state['step'] == 'confirm': # Đã có đủ thông tin, tạo lịch hẹn
            # parse_appointment_state đã xác nhận time
            # Create appointment
            appointment_data = {
                'patient_id': state['patient_id'],
                'doctor_id': state['doctor_id'],
                'date': state['date'],
                'time': state['time'], # Time đã có :SS từ parse_appointment_state
                'service_type': state['service_type'],
                'duration': state['duration'],
                'status': 'pending',
                'notes': 'Lịch hẹn được tạo thông qua chatbot'
            }
            
            appointment, error = create_appointment(appointment_data)
            if appointment:
                time_display = datetime.strptime(state['time'], '%H:%M:%S').strftime('%H:%M')
                return f"✅ Đặt lịch thành công!\n\nThông tin lịch hẹn:\n- Ngày: {state['date']}\n- Giờ: {time_display}\n- Trạng thái: Chờ xác nhận\n\nMã lịch hẹn: {appointment.get('id', 'N/A')}\n\nCảm ơn bạn đã sử dụng dịch vụ!"
            else:
                return f"❌ Có lỗi xảy ra khi đặt lịch: {error}\n\nVui lòng thử lại sau hoặc liên hệ trực tiếp với bệnh viện."
    
    return None

@csrf_exempt
def chat(request):
    if request.method == 'OPTIONS':
        response = JsonResponse({'detail': 'CORS preflight'})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    
    if request.method != 'POST':
        return JsonResponse({'error': 'Chỉ hỗ trợ POST'}, status=405)
    
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '')
        session_id = data.get('session_id', 'default')
        history = data.get('history', [])
        
        # Lấy trạng thái cuộc hội thoại
        state = conversation_manager.get_conversation(session_id)
        
        # Bỏ qua toàn bộ logic đặt lịch, chỉ trả về chẩn đoán bệnh
        update_diagnosis_state(state.diagnosis_state, user_message)
        response, is_diagnosis = get_diagnosis_response(state.diagnosis_state)
        return JsonResponse({'response': response})
    
    except Exception as e:
        response = JsonResponse({'error': str(e)})
        response["Access-Control-Allow-Origin"] = "*"
        return response 