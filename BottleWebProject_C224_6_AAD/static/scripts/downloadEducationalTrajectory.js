// Регулярка для проверки email
const emailPattern = /^(?=[a-zA-Z0-9])(?!.*\.\.)[a-zA-Z0-9_.-]{2,64}@(?=.{1,255}$)[a-zA-Z0-9-]+\.[a-zA-Z]{2,63}$/;

// Проверяет корректность email
function validateEmail(email) {
    return emailPattern.test(email);
}

// Парсит результат из левого блока по разделам (маршрут, метрики, ключевые темы)
function parseResultBlock() {
    const block = document.querySelector(".left-panel .content-block"); // Получаем блок результата
    if (!block) return null;

    const data = {
        learning_path: [],
        metrics: {},
        relevant_topics: {}
    };

    let mode = null;
    for (const el of block.children) {
        if (el.tagName === "H3") { // Определяем текущий раздел
            if (el.textContent.includes("Optimal Learning Path")) {
                mode = "learning_path";
                continue;
            }
            if (el.textContent.includes("Metrics")) {
                mode = "metrics";
                continue;
            }
            if (el.textContent.includes("Most Relevant Topics")) {
                mode = "relevant_topics";
                continue;
            }
            mode = null;
        }
        // Парсим маршрут обучения из <ol>
        if (mode === "learning_path" && el.tagName === "OL") {
            for (const li of el.children) {
                data.learning_path.push(li.textContent.trim());
            }
        }
        // Парсим метрики из <ul>
        if (mode === "metrics" && el.tagName === "UL") {
            for (const li of el.children) {
                const [key, ...rest] = li.textContent.split(":");
                data.metrics[key.trim()] = rest.join(":").trim();
            }
        }
        // Парсим ключевые темы из <ul>
        if (mode === "relevant_topics" && el.tagName === "UL") {
            for (const li of el.children) {
                const [key, ...rest] = li.textContent.split(":");
                data.relevant_topics[key.trim()] = rest.join(":").trim();
            }
        }
    }
    return data;
}

// Сохраняет результат: валидирует, парсит и отправляет на сервер, после чего скачивает json
function saveUserResult() {
    const nameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    // Сброс сообщений об ошибках
    nameError.innerText = "";
    emailError.innerText = "";

    let valid = true;
    if (!name) { // Проверка имени
        nameError.innerText = "Enter your name";
        valid = false;
    }
    if (!email) { // Проверка email
        emailError.innerText = "Enter your email";
        valid = false;
    } else if (!validateEmail(email)) { // Проверка формата email
        emailError.innerText = "Enter a valid email";
        valid = false;
    }
    if (!valid) return; // Если ошибки — прерываем

    const parsed = parseResultBlock(); // Парсим результат по разделам
    if (!parsed) {
        alert("No result content found");
        return;
    }

    // Собираем данные для отправки
    const postData = {
        name: name,
        email: email,
        date: new Date().toISOString(),
        result: parsed
    };

    // Отправка данных на сервер через POST-запрос
    fetch('/save_result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert("Error saving: " + data.error); // Сообщение об ошибке сервера
        } else {
            // Создаём и скачиваем файл с результатом
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${email.replace(/[^a-z0-9]/gi, '_')}_trajectory_result.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    })
    .catch(err => {
        console.error("Error saving result:", err);
        alert("Unexpected error occurred");
    });
}

// Назначает обработчик нажатия кнопки "Save Result" после загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("save-btn");
    if (btn) {
        btn.addEventListener("click", saveUserResult);
    }
});