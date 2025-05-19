import os
import json
from bottle import request, response, post

PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))
DATA_FILE = os.path.join(PROJECT_ROOT, 'all_results.json')

@post('/save_result')
def save_result():
    try:
        data = request.json

        # Чтение существующих данных
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                all_data = json.load(f)
        else:
            all_data = []

        all_data.append(data)

        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(all_data, f, indent=2, ensure_ascii=False)

        # Фильтруем записи по email
        user_entries = [entry for entry in all_data if entry['email'] == data['email']]
        response.content_type = 'application/json'
        return json.dumps(user_entries, ensure_ascii=False)

    except Exception as e:
        print("ERROR in save_result:", e)
        response.status = 500
        return {'error': str(e)}
