import os
import json
from bottle import request, response, post

# Определяем путь к корневой папке проекта (один уровень вверх от текущего файла)
PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))

# Путь к файлу, где будут храниться все результаты пользователей
DATA_FILE = os.path.join(PROJECT_ROOT, 'all_results.json')

# Обработчик POST-запроса на маршрут /save_result
@post('/save_result')
def save_result():
    try:
        # Получаем JSON-данные, отправленные с клиента
        data = request.json

        # Если файл с результатами уже существует — читаем его содержимое
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                all_data = json.load(f)  # Загружаем список существующих записей
        else:
            all_data = []  # Если файл не существует — создаем пустой список

        # Добавляем новые данные к списку всех записей
        all_data.append(data)

        # Перезаписываем файл с обновлённым списком всех данных
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(all_data, f, indent=2, ensure_ascii=False)

        # Фильтруем и возвращаем только записи, относящиеся к текущему email
        user_entries = [entry for entry in all_data if entry['email'] == data['email']]

        # Устанавливаем тип ответа — JSON
        response.content_type = 'application/json'
        # Возвращаем отфильтрованные записи в формате JSON
        return json.dumps(user_entries, ensure_ascii=False)

    except Exception as e:
        # Если возникает ошибка — логируем её и возвращаем статус 500 (внутренняя ошибка сервера)
        print("ERROR in save_result:", e)
        response.status = 500
        return {'error': str(e)}
