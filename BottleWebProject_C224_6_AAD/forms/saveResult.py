import os
import json
from bottle import request, response, post

PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))
DATA_FILE = os.path.join(PROJECT_ROOT, 'all_results.json')

@post('/save_result')
def save_result():
    try:
        data = request.json
        email = data.get('email')
        name = data.get('name')
        date = data.get('date')

        # Получаем три возможных типа данных
        recommendation_data = data.get('recommendation_system')
        girvan_data = data.get('girvan_newman')
        trajectory_data = data.get('educational_trajectory')

        if not (email and name and date):
            response.status = 400
            return {'error': 'Missing required fields'}

        if not (recommendation_data or girvan_data or trajectory_data):
            response.status = 400
            return {'error': 'No analysis data provided'}

        # Загружаем текущие данные
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                try:
                    all_data = json.load(f)
                except json.JSONDecodeError:
                    all_data = {}
        else:
            all_data = {}

        if not isinstance(all_data, dict):
            all_data = {}

        # Проверка email
        if email in all_data:
            existing_name = all_data[email].get('name')
            if existing_name != name:
                response.status = 400
                return {'error': f"Email {email} is already registered to '{existing_name}'"}
        else:
            all_data[email] = {'name': name, 'entries': []}

        # Формируем entry с доступными данными
        entry = {
            'date': date,
            'source': source,
        }
        if recommendation_data:
            entry['recommendation_system'] = recommendation_data
        if girvan_data:
            entry['girvan_newman'] = girvan_data
        if trajectory_data:
            entry['educational_trajectory'] = trajectory_data

        # Добавляем запись
        all_data[email]['entries'].append(entry)

        # Сохраняем в файл
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(all_data, f, indent=2, ensure_ascii=False)

        # Возвращаем все записи пользователя
        response.content_type = 'application/json'
        return json.dumps(all_data[email], ensure_ascii=False)

    except Exception as e:
        print("ERROR in save_result:", e)
        response.status = 500
        return {'error': str(e)}
