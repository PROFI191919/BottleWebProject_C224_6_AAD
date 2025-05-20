// Функция для создания таблицы смежности (n x n) в DOM
// Если fillRandom = true, матрица будет заполнена случайными значениями (ребра есть/нет)
function createMatrix(n, fillRandom = false) {
    const container = document.getElementById("matrixContainer");
    container.innerHTML = "";  // Очищаем контейнер перед созданием новой таблицы

    const table = document.createElement("table");

    // Создаем заголовок строки (шапка таблицы)
    const headerRow = document.createElement("tr");
    headerRow.appendChild(document.createElement("th")); // Пустой угол

    // Добавляем заголовки столбцов V1, V2, ..., Vn
    for (let i = 0; i < n; i++) {
        const th = document.createElement("th");
        th.textContent = `V${i + 1}`;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Создаем пустую матрицу n x n с булевыми значениями
    const matrix = Array.from({ length: n }, () => Array(n).fill(false));

    // Если включен режим случайной генерации, заполняем верхнюю треугольную часть
    if (fillRandom) {
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const val = Math.random() < 0.5;  // С вероятностью 50% создаём ребро
                matrix[i][j] = val;
                matrix[j][i] = val;  // Обеспечиваем симметрию (граф неориентированный)
            }
        }
    }

    // Заполняем таблицу по строкам
    for (let i = 0; i < n; i++) {
        const row = document.createElement("tr");

        // Заголовок строки (V1, V2 и т.д.)
        const rowHeader = document.createElement("th");
        rowHeader.textContent = `V${i + 1}`;
        row.appendChild(rowHeader);

        // Ячейки строки
        for (let j = 0; j < n; j++) {
            const cell = document.createElement("td");

            if (i === j) {
                // Диагональ — запрещаем петли: отключаем чекбокс
                const disabledBox = document.createElement("input");
                disabledBox.type = "checkbox";
                disabledBox.disabled = true;
                disabledBox.checked = false;
                disabledBox.style.opacity = "0.4";          // Уменьшаем видимость
                disabledBox.style.pointerEvents = "none";   // Запрещаем взаимодействие
                cell.appendChild(disabledBox);
            } else {
                // Чекбокс для остальных ячеек (ребро между вершинами i и j)
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = `matrix[${i}][${j}]`;
                checkbox.style.width = "20px";
                checkbox.style.height = "20px";
                checkbox.checked = matrix[i][j];  // Устанавливаем состояние

                // Добавляем слушатель: при изменении состояния — отражаем это в зеркальной ячейке
                checkbox.addEventListener("change", () => {
                    const mirrorCheckbox = document.querySelector(`input[name='matrix[${j}][${i}]']`);
                    if (mirrorCheckbox) mirrorCheckbox.checked = checkbox.checked;
                });

                cell.appendChild(checkbox);
            }

            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    // Добавляем построенную таблицу в DOM
    container.appendChild(table);
}

// Настраиваем элементы управления: генерация матрицы, валидация, отправка формы
function setupMatrixControls() {
    const createBtn = document.getElementById("createEmptyMatrixBtn");
    const randomBtn = document.getElementById("fillRandomBtn");
    const nodeCountInput = document.getElementById("nodeCount");
    const nodeCountError = document.getElementById("nodeCountError");

    // Проверка корректности введенного количества узлов
    function validateN() {
        const n = Number(nodeCountInput.value);
        if (!Number.isInteger(n) || n < 2 || n > 10) {
            // Ошибка, если введено некорректное значение
            nodeCountError.textContent = "Please enter an integer between 2 and 10.";
            nodeCountError.style.display = "block";
            console.warn("Invalid node count entered.");
            return null;
        }
        // Если всё хорошо, скрываем сообщение об ошибке
        nodeCountError.textContent = "";
        nodeCountError.style.display = "none";
        return n;
    }

    // Обработчик кнопки "Создать пустую матрицу"
    createBtn.addEventListener("click", () => {
        const n = validateN();
        if (n !== null) {
            console.log("Creating empty matrix with", n, "nodes");
            createMatrix(n, false);
        }
    });

    // Обработчик кнопки "Заполнить случайно"
    randomBtn.addEventListener("click", () => {
        const n = validateN();
        if (n !== null) {
            console.log("Creating random matrix with", n, "nodes");
            createMatrix(n, true);
        }
    });

    // При загрузке страницы создаём матрицу 4x4 по умолчанию
    window.addEventListener("DOMContentLoaded", () => {
        console.log("Page loaded — generating default matrix (4x4)");
        createMatrix(4, false);
    });

    // Обработка формы — преобразуем состояние чекбоксов в матрицу и сериализуем в JSON
    const form = document.getElementById("adjacencyMatrixForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            const n = Number(nodeCountInput.value);
            const matrixData = [];

            let hasEdge = false;  // Флаг — есть ли хотя бы одно ребро

            for (let i = 0; i < n; i++) {
                const row = [];
                for (let j = 0; j < n; j++) {
                    const checkbox = document.querySelector(`input[name='matrix[${i}][${j}]']`);
                    const checked = checkbox && checkbox.checked;
                    row.push(checked ? 1 : 0);
                    if (checked) hasEdge = true;
                }
                matrixData.push(row);
            }

            if (!hasEdge) {
                // Если все ячейки пусты — не отправляем форму
                e.preventDefault();
                matrixError.textContent = "Please select at least one edge in the matrix.";
                matrixError.style.display = "block";
                console.warn("Empty adjacency matrix submitted");
                return;
            } else {
                matrixError.textContent = "";
                matrixError.style.display = "none";
            }

            // Сохраняем JSON в скрытое поле, которое будет отправлено на сервер
            const hiddenInput = document.getElementById("matrixData");
            if (hiddenInput) {
                hiddenInput.value = JSON.stringify(matrixData);
                console.log("Matrix data saved to hidden input");
            }
        });
    } else {
        console.warn("Form #adjacencyMatrixForm not found.");
    }
}

// Запускаем настройку при загрузке скрипта
setupMatrixControls();
