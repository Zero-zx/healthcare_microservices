import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# Đường dẫn tuyệt đối tới file KB
KB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'kb', 'diseases.json')

with open(KB_PATH, encoding='utf-8') as f:
    KB = json.load(f)

ALL_SYMPTOMS = set()
for disease in KB.values():
    ALL_SYMPTOMS.update(disease['symptoms'])

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
        history = data.get('history', [])
        # Lấy các triệu chứng user đã xác nhận "Có" hoặc nhập tự do
        user_symptoms = set()
        for msg in history:
            if msg['sender'] == 'user':
                if msg.get('answer', '').lower() == 'có':
                    # Trích xuất triệu chứng từ câu hỏi của bot mà user trả lời "Có"
                    question_text = msg['text'] # Đây là câu hỏi của bot, ví dụ: "Bạn có bị ho không?"
                    if question_text.startswith('Bạn có bị ') and question_text.endswith(' không?'):
                        symptom = question_text.replace('Bạn có bị ', '').replace(' không?', '')
                        user_symptoms.add(symptom)
                elif not msg.get('answer'): # User nhập tự do
                    # Tìm các triệu chứng có trong text người dùng nhập
                    for symptom_kb in ALL_SYMPTOMS: # Đổi tên biến để tránh nhầm lẫn
                        if symptom_kb in msg['text'].lower():
                            user_symptoms.add(symptom_kb)

        # Lấy các triệu chứng user đã xác nhận 'Không'
        negative_symptoms = set([
            msg['text'] for msg in history if msg['sender'] == 'user' and msg.get('answer', '').lower() == 'không'
        ])
        # Lấy các triệu chứng đã hỏi
        asked_symptoms = set([
            msg['text'].replace('Bạn có bị ', '').replace(' không?', '')
            for msg in history if msg['sender'] == 'bot' and msg['text'].startswith('Bạn có bị ')
        ])
        # Nếu chưa có triệu chứng nào, hỏi triệu chứng đầu tiên hoặc báo không nhận diện được triệu chứng
        if not user_symptoms:
            # Kiểm tra nếu user đã nhập tự do nhưng không khớp triệu chứng nào
            if any(msg['sender'] == 'user' and not msg.get('answer') and msg['text'].strip() for msg in history):
                response = JsonResponse({"reply": "Tôi chưa từng nghe triệu chứng đó, bạn còn gặp triệu chứng nào khác không?", "audio": "Tôi chưa từng nghe triệu chứng đó, bạn còn gặp triệu chứng nào khác không?"})
                response["Access-Control-Allow-Origin"] = "*"
                return response
            response = JsonResponse({"reply": "Triệu chứng bạn gặp phải là gì?", "audio": "Triệu chứng bạn gặp phải là gì?"})
            response["Access-Control-Allow-Origin"] = "*"
            return response
        # 1. Lọc danh sách bệnh còn lại dựa trên các triệu chứng user đã xác nhận
        possible_diseases = []
        for code, disease in KB.items():
            # Loại trừ bệnh nếu user đã trả lời 'không' cho bất kỳ triệu chứng nào của bệnh
            if all(sym in disease['symptoms'] for sym in user_symptoms) and not any(sym in disease['symptoms'] for sym in negative_symptoms):
                possible_diseases.append((code, disease))
        if not possible_diseases:
            # Nếu không còn bệnh nào phù hợp, hướng dẫn nhập thêm triệu chứng
            response = JsonResponse({"reply": "Chưa đủ dữ liệu để chẩn đoán. Bạn hãy nhập thêm triệu chứng khác nếu có!", "audio": "Chưa đủ dữ liệu để chẩn đoán. Bạn hãy nhập thêm triệu chứng khác nếu có!"})
            response["Access-Control-Allow-Origin"] = "*"
            return response
        # Nếu chỉ còn 1 bệnh, chỉ chẩn đoán khi đủ độ tin cậy hoặc đã hỏi hết triệu chứng, nếu không hỏi tiếp triệu chứng còn lại
        if len(possible_diseases) == 1:
            code, disease = possible_diseases[0]
            remaining_symptoms = [sym for sym in disease['symptoms'] if sym not in user_symptoms and sym not in asked_symptoms and sym not in negative_symptoms]
            match = len(user_symptoms & set(disease['symptoms']))
            confidence = int(100 * match / len(disease['symptoms']))
            if confidence >= 80 or not remaining_symptoms:
                name = disease['name']
                treatment = disease['treatment']
                reply = f"Bạn có thể đang bị {name} (độ tin cậy {confidence}%). Khuyến nghị: {treatment}"
                response = JsonResponse({"reply": reply, "audio": reply})
                response["Access-Control-Allow-Origin"] = "*"
                return response
            # Nếu chưa đủ độ tin cậy, hỏi tiếp triệu chứng còn lại của bệnh này
            next_symptom = remaining_symptoms[0]
            response = JsonResponse({"reply": f"Bạn có bị {next_symptom} không?", "audio": f"Bạn có bị {next_symptom} không?"})
            response["Access-Control-Allow-Origin"] = "*"
            return response
        # Nếu còn nhiều bệnh, hỏi triệu chứng phân biệt nhất
        symptom_count = {}
        for code, disease in possible_diseases:
            for symptom in disease['symptoms']:
                if symptom not in user_symptoms and symptom not in asked_symptoms and symptom not in negative_symptoms:
                    symptom_count[symptom] = symptom_count.get(symptom, 0) + 1
        if not symptom_count:
            # Không còn triệu chứng nào để hỏi, đề xuất nhập thêm triệu chứng tự do
            response = JsonResponse({"reply": "Chưa đủ dữ liệu để chẩn đoán. Bạn hãy nhập thêm triệu chứng khác nếu có!", "audio": "Chưa đủ dữ liệu để chẩn đoán. Bạn hãy nhập thêm triệu chứng khác nếu có!"})
            response["Access-Control-Allow-Origin"] = "*"
            return response
        n = len(possible_diseases)
        best_symptom = min(symptom_count, key=lambda s: abs(symptom_count[s] - n/2))
        response = JsonResponse({"reply": f"Bạn có bị {best_symptom} không?", "audio": f"Bạn có bị {best_symptom} không?"})
        response["Access-Control-Allow-Origin"] = "*"
        return response
    except Exception as e:
        response = JsonResponse({'error': str(e)})
        response["Access-Control-Allow-Origin"] = "*"
        return response 