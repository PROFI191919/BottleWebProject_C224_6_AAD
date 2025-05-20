// Регулярное выражение для проверки email-адреса
const emailPattern = /^(?=[a-zA-Z0-9])(?!.*\.\.)[a-zA-Z0-9_.-]{2,64}@(?=.{1,255}$)[a-zA-Z0-9-]+\.[a-zA-Z]{2,63}$/;

// Функция для проверки валидности email
function validateEmail(email) {
    return emailPattern.test(email);
}

// Получение локальной строки с датой и временем
function getLocalDateTimeString() {
    const now = new Date();
    return now.toLocaleString('ru-RU'); // например: "20.05.2025, 16:20:01"
}

// Главная функция для сбора и отправки результатов
function downloadResult() {
    // Получаем поля ввода и элементы для отображения ошибок
    const nameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    const nameError = document.getElementById("nameError");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    // Сброс ошибок
    emailError.innerText = "";
    nameError.innerText = "";

    let valid = true;

    // Проверка имени
    if (!name) {
        nameError.innerText = "Enter your name";
        valid = false;
    }

    // Проверка email
    if (!email) {
        emailError.innerText = "Enter your email";
        valid = false;
    } else if (!validateEmail(email)) {
        emailError.innerText = "Enter a correct email";
        valid = false;
    }

    if (!valid) {
        return; // Прекращаем, если есть ошибки
    }

    // Ищем блок с результатами (слева)
    const block = document.querySelector(".left-panel .content-block");
    if (!block) {
        alert("No data for save");
        return;
    }

    const usersData = {};  // Сюда будут сохраняться интересы и рекомендации пользователей

    // Проходим по дочерним элементам блока
    for (const el of block.children) {
        // Находим заголовки (например, User 1:)
        if (el.tagName === "H3" && el.textContent.includes(":")) {
            const user = el.textContent.replace(":", "").trim();

            // Пропускаем служебные заголовки
            if (user === "Graph metrics" || user === "Explanation") continue;

            const interestsP = el.nextElementSibling; // Берём следующий соседний элемент
            const recommendationsPre = interestsP?.nextElementSibling?.nextElementSibling; // Берём элемент после interestsP

            // Считываем интересы пользователя
            // Создаём пустой массив для хранения интересов пользователя
            const interests = [];

            // Проверяем, что элемент interestsP существует и является тегом <p>
            if (interestsP && interestsP.tagName === "P") {
                // Ищем в тексте элемента interestsP строку, начинающуюся с "List of interests: "
                // и захватываем всё, что идёт после этой фразы
                const match = interestsP.textContent.match(/List of interests: (.*)/);

                // Если совпадение найдено и текст не равен "The user has no interests."
                if (match && match[1] !== "The user has no interests.") {
                    // Разбиваем строку интересов по запятым, убираем пробелы у каждого элемента
                    // и добавляем полученные значения в массив interests
                    interests.push(...match[1].split(",").map(i => i.trim()));
                }
            }

            // Считываем рекомендации
            // Создаём пустой массив для хранения рекомендаций пользователя
            const recommendations = [];

            // Проверяем, что элемент recommendationsPre существует и является тегом <pre>
            if (recommendationsPre && recommendationsPre.tagName === "PRE") {
                // Получаем текстовое содержимое элемента и разбиваем его на строки по символу новой строки
                // Затем фильтруем пустые строки, оставляя только непустые
                const lines = recommendationsPre.textContent.split("\n").filter(Boolean);

                for (const line of lines) {
                    // Ищем
                    // 1. Группу символов (название элемента) - максимально короткую последовательность до первого пробела
                    // 2. Один или несколько пробелов
                    // 3. Группу цифр или точки (оценка / рейтинг)
                    const parts = line.trim().match(/^(.+?)\s+([\d.]+)$/);

                    // Если совпадение найдено, разбиваем строку на название элемента и его числовой рейтинг
                    if (parts) {
                        // Добавляем объект с названием элемента и числовой оценкой в массив recommendations
                        recommendations.push({
                            item: parts[1].trim(), // название элемента, убираем пробелы
                            score: parseFloat(parts[2]) // преобразуем в float
                        });
                    }
                }
            }

            // Добавляем данные пользователя в итоговый объект
            usersData[user] = {
                interests: interests,
                recommendations: recommendations
            };
        }
    }

    // Если нет данных ни у одного пользователя — сообщаем об этом
    if (Object.keys(usersData).length === 0) {
        alert("No data for saving");
        return;
    }

    // Генерируем метку времени
    const timestamp = Date.now();

    // Подготавливаем данные для отправки
    const postData = {
        email: email,
        name: name,
        date: getLocalDateTimeString(),
        recommendation_system: {
            [timestamp]: {
                data: usersData
            }
        }
    };

    // Отправка данных на сервер методом POST
    fetch('/save_result', {
        method: 'POST', // Метод запроса — POST (отправка данных)
        headers: { 'Content-Type': 'application/json' }, // Указываем, что отправляем JSON
        body: JSON.stringify(postData) // Преобразуем объект postData в строку JSON
    })
        // После отправки ждем ответ от сервера и преобразуем его в JSON
        .then(response => response.json())
        .then(data => {
            // Если сервер вернул ошибку, выводим её пользователю
            if (data.error) {
                alert("Error: " + data.error);
            } else {
                // Если всё прошло успешно:
                // Создаем объект Blob из ответа (с отступами для читаемости)
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

                // Создаем временную ссылку на файл
                const url = URL.createObjectURL(blob);

                // Создаем элемент <a> для запуска скачивания
                const a = document.createElement('a');
                a.href = url;

                // Название файла — email_в_безопасной_форме_results.json
                // Заменяем все символы, кроме латинских букв и цифр, на подчёркивание
                a.download = `${email.replace(/[^a-z0-9]/gi, '_')}_results.json`;

                // Программно "кликаем" по ссылке — запускаем скачивание
                a.click();

                // Очищаем временный URL из памяти
                URL.revokeObjectURL(url);
            }
        })
        // Обработка ошибки при запросе (например, сеть недоступна)
        .catch(error => {
            console.error("Error in sending: ", error);
            alert("An error occurred while sending data"); // Сообщение пользователю
        });
}

// Добавляем обработчик кнопки "Save" при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Находим кнопку "Save" по ID
    const btn = document.getElementById('save-btn');

    // Назначаем обработчик клика, если кнопка найдена
    if (btn) btn.addEventListener('click', downloadResult);
});
