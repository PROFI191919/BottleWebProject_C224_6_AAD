// Функция создания таблицы
function generateMatrix() {
    // Получаем количество пользователей (строки) и предметов (столбцы) из input-полей
    const m = Number(document.getElementById('numUsers').value);  // rows
    const n = Number(document.getElementById('numItems').value);  // columns

    // Ссылки на элементы вывода ошибок валидации
    const errorM = document.getElementById('numUsersError');
    const errorN = document.getElementById('numItemsError');

    let valid = true; // Флаг корректности данных

    // Проверка числа пользователей: должно быть от 3 до 10
    if (!Number.isInteger(m) || m < 3 || m > 10) {
        errorM.innerText = "Please enter a number between 3 and 10";
        valid = false;
    } else {
        errorM.innerText = "";
    }

    // Проверка числа интересов: от 2 до 10
    if (!Number.isInteger(n) || n < 2 || n > 10) {
        errorN.innerText = "Please enter a number between 2 and 10";
        valid = false;
    } else {
        errorN.innerText = "";
    }

    if (!valid) {
        // Если данные некорректны, не продолжаем выполнение
        return;
    }

    // Очищаем контейнер с таблицей, если он уже был заполнен
    const container = document.getElementById('tableContainer');
    container.innerHTML = '';

    // Создаем таблицу
    const table = document.createElement('table');
    table.className = 'styled-table';

    // Создаем заголовок таблицы
    const headerRow = document.createElement('tr');
    const topLeft = document.createElement('th');
    topLeft.className = "header";
    topLeft.innerText = "Users \\ Items";  // Верхняя левая ячейка
    headerRow.appendChild(topLeft);

    // Создаем заголовки столбцов: Item 1, Item 2, ...
    for (let j = 1; j <= n; j++) {
        const th = document.createElement('th');
        th.className = "header";
        th.innerText = `Item ${j}`;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);  // Добавляем заголовок в таблицу

    // Создаем строки с пользователями и выпадающими списками оценок
    for (let i = 1; i <= m; i++) {
        const row = document.createElement('tr');

        // Первая ячейка строки — имя пользователя
        const userCell = document.createElement('th');
        userCell.className = "header";
        userCell.innerText = `User ${i}`;
        row.appendChild(userCell);

        // Остальные ячейки — select с рейтингами от 0 до 5
        for (let j = 1; j <= n; j++) {
            const td = document.createElement('td');
            const select = document.createElement('select');
            select.style.padding = "5px";
            select.name = `rating_u${i}_i${j}`;  // Уникальное имя для идентификации

            // Заполняем select значениями от 0 до 5
            for (let k = 0; k <= 5; k++) {
                const option = document.createElement('option');
                option.value = k;
                option.innerText = k;
                select.appendChild(option);
            }
            td.appendChild(select);
            row.appendChild(td);
        }
        table.appendChild(row);  // Добавляем строку в таблицу
    }

    // Вставляем готовую таблицу в контейнер
    container.appendChild(table);
}

// Функция рандомной генерации
function fillRandom() {
    // Находим все выпадающие списки внутри таблицы
    const selects = document.querySelectorAll('#tableContainer select');

    // Присваиваем каждому случайное значение от 0 до 5
    selects.forEach(select => {
        const randomValue = Math.floor(Math.random() * 6); // генерирует 0–5
        select.value = randomValue;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Генерируем таблицу при загрузке страницы
    generateMatrix();

    // Обрабатываем отправку формы
    const form = document.getElementById('ratingMatrixForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            // Находим все поля с оценками
            const selects = document.querySelectorAll('#tableContainer select');
            const data = [];

            // Преобразуем данные в массив объектов
            selects.forEach(select => {
                const [u, i] = select.name.match(/\d+/g);  // Извлекаем номера пользователя и предмета (ex., rating_u1_i1)
                data.push({
                    user: `User ${u}`,
                    item: `Item ${i}`,
                    rating: parseInt(select.value)
                });
            });

            // Сохраняем сериализованные данные в скрытое поле
            document.getElementById('matrixData').value = JSON.stringify(data);
        });
    }
});