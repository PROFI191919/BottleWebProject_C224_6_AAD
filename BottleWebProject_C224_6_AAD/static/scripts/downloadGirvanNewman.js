// Шаблон регулярного выражения для проверки email-адреса
// Условие: начинается с буквы/цифры, без двойных точек, корректная доменная часть
const emailPattern = /^(?=[a-zA-Z0-9])(?!.*\.\.)[a-zA-Z0-9_.-]{2,64}@(?=.{1,255}$)[a-zA-Z0-9-]+\.[a-zA-Z]{2,63}$/;

// Функция, проверяющая email на соответствие шаблону
function validateEmail(email) {
    return emailPattern.test(email);
}

// Получение текущей локальной даты и времени
function getLocalDateTimeString() {
    const now = new Date();
    return now.toLocaleString('ru-RU');
}

// Основная функция, вызываемая при нажатии кнопки "Сохранить результат"
function downloadResult() {
    // Получаем элементы ввода имени и email
    const nameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");

    // Получаем элементы для вывода ошибок
    const emailError = document.getElementById("emailError");
    const nameError = document.getElementById("nameError");

    // Получаем блок, в котором отображаются метрики графа
    const block = document.querySelector(".left-panel .content-block");

    // Получаем значения полей ввода и обрезаем пробелы
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    // Сброс предыдущих сообщений об ошибках
    emailError.innerText = "";
    nameError.innerText = "";

    let valid = true;

    // Валидация имени: должно быть непустым
    if (!name) {
        nameError.innerText = "Enter your name";
        valid = false;
    }

    // Валидация email: должен быть непустым и соответствовать формату
    if (!email) {
        emailError.innerText = "Enter your email";
        valid = false;
    } else if (!validateEmail(email)) {
        emailError.innerText = "Enter a correct email";
        valid = false;
    }

    // Если имя или email некорректны — выход из функции
    if (!valid) return;

    // Объект для хранения метрик графа
    let graphMetricsObj = {};
    let foundMetrics = false;

    // Ищем заголовок "Graph metrics:" в DOM-элементах блока
    for (const el of block.children) {
        if (el.tagName === "H3" && el.textContent.trim() === "Graph metrics:") {
            foundMetrics = true;
            continue; // Переходим к следующему элементу — ожидаем список <ul>
        }

        if (foundMetrics) {
            // Обработка найденного списка метрик
            if (el.tagName === "UL") {
                for (const li of el.querySelectorAll("li")) {
                    const text = li.textContent.trim(); // Пример: "Graph density: 0.25"
                    const colonIndex = text.indexOf(":");
                    if (colonIndex === -1) continue; // Пропускаем строки без ":" (некорректные)

                    const key = text.substring(0, colonIndex).trim();   // Название метрики
                    const val = text.substring(colonIndex + 1).trim();  // Значение метрики

                    // Если метрика — Degree per node, это JSON-объект вида: "0: 2, 1: 3"
                    if (key === "Degree per node") {
                        // Преобразуем в JSON: добавляем кавычки к ключам
                        const jsonReady = val.replace(/(\d+)\s*:/g, '"$1":');
                        try {
                            graphMetricsObj[key] = JSON.parse(jsonReady);
                        } catch (e) {
                            console.warn("Failed to parse Degree per node:", e);
                            graphMetricsObj[key] = val;
                        }
                    }
                    // Если метрика числовая — парсим в float
                    else if (key === "Graph density" || key === "Average clustering coefficient") {
                        graphMetricsObj[key] = parseFloat(val);
                    }
                    // Все остальные метрики — сохраняем как строки
                    else {
                        graphMetricsObj[key] = val;
                    }
                }
                break; // Закончили обработку метрик
            }
            // Если после заголовка сразу идёт другой контент (не <ul>), завершаем
            else if (el.tagName !== "UL" && el.textContent.trim() !== "") {
                break;
            }
        }
    }

    // Если метрики так и не были найдены — предупреждение и выход
    if (!foundMetrics) {
        alert("Graph metrics не найдены.");
        return;
    }

    // Подготовка данных для отправки на сервер
    const postData = {
        algorithm: "Girvan Newman", // Название алгоритма
        name: name,                 // Имя пользователя
        email: email,               // Email пользователя
        result: graphMetricsObj,    // Извлечённые метрики графа
        date: getLocalDateTimeString() // Дата и время сохранения
    };

    // Отправляем JSON на сервер по маршруту /save_result
    fetch('/save_result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
    })
        .then(response => {
            if (!response.ok) throw new Error(`Save failed (${response.status})`);
            return response.json(); // Получаем JSON с результатами
        })
        .then(userEntries => {
            // Преобразуем результат в строку и создаём blob-файл
            const jsonStr = JSON.stringify(userEntries, null, 2); // Формат с отступами
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // Создаём ссылку для скачивания
            const a = document.createElement('a');
            a.href = url;
            a.download = `${email.replace(/[^a-z0-9]/gi, '_')}_results.json`;
            document.body.appendChild(a);
            a.click(); // Запускаем скачивание
            document.body.removeChild(a);

            // Очищаем временный URL
            URL.revokeObjectURL(url);
        })
        .catch(err => {
            console.error("Error in save/download:", err);
            alert("Ошибка: " + err.message); // Отображаем сообщение об ошибке
        });
}

// Назначаем обработчик кнопке "Сохранить результат" после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('save-btn');
    if (btn) {
        btn.addEventListener('click', downloadResult); // Привязываем обработчик
        console.log("Listener added to #save-btn");
    } else {
        console.warn("Button with ID #save-btn was not found");
    }
});
