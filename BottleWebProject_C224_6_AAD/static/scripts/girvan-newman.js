function createMatrix(n, fillRandom = false) {
    const container = document.getElementById("matrixContainer");
    container.innerHTML = "";

    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
    headerRow.appendChild(document.createElement("th"));

    for (let i = 0; i < n; i++) {
        const th = document.createElement("th");
        th.textContent = `V${i + 1}`;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    const matrix = Array.from({ length: n }, () => Array(n).fill(false));
    if (fillRandom) {
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const val = Math.random() < 0.5;
                matrix[i][j] = val;
                matrix[j][i] = val;
            }
        }
    }

    for (let i = 0; i < n; i++) {
        const row = document.createElement("tr");
        const rowHeader = document.createElement("th");
        rowHeader.textContent = `V${i + 1}`;
        row.appendChild(rowHeader);

        for (let j = 0; j < n; j++) {
            const cell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = `matrix[${i}][${j}]`;
            checkbox.style.width = "20px";
            checkbox.style.height = "20px";
            checkbox.checked = matrix[i][j];
            checkbox.addEventListener("change", () => {
                const mirrorCheckbox = document.querySelector(`input[name='matrix[${j}][${i}]']`);
                if (mirrorCheckbox) mirrorCheckbox.checked = checkbox.checked;
            });
            cell.appendChild(checkbox);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    container.appendChild(table);
}

function setupMatrixControls() {
    const createBtn = document.getElementById("createEmptyMatrixBtn");
    const randomBtn = document.getElementById("fillRandomBtn");
    const nodeCountInput = document.getElementById("nodeCount");
    const nodeCountError = document.getElementById("nodeCountError");

    function validateN() {
        const n = Number(nodeCountInput.value);
        if (!Number.isInteger(n) || n < 1 || n > 10) {
            nodeCountError.textContent = "Please enter an integer between 1 and 10.";
            nodeCountError.style.display = "block";
            return null;
        }
        nodeCountError.textContent = "";
        nodeCountError.style.display = "none";
        return n;
    }

    createBtn.addEventListener("click", () => {
        const n = validateN();
        if (n !== null) {
            createMatrix(n, false);
        }
    });

    randomBtn.addEventListener("click", () => {
        const n = validateN();
        if (n !== null) {
            createMatrix(n, true);
        }
    });

    // Создаём матрицу по умолчанию при загрузке страницы
    window.addEventListener("DOMContentLoaded", () => {
        createMatrix(4, false);
    });

    // Обработка формы перед отправкой
    const form = document.getElementById("adjacencyMatrixForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            const n = Number(nodeCountInput.value);
            const matrixData = [];
            for (let i = 0; i < n; i++) {
                const row = [];
                for (let j = 0; j < n; j++) {
                    const checkbox = document.querySelector(`input[name='matrix[${i}][${j}]']`);
                    row.push(checkbox && checkbox.checked ? 1 : 0);
                }
                matrixData.push(row);
            }
            // Записываем JSON-массив в скрытое поле
            const hiddenInput = document.getElementById("matrixData");
            if (hiddenInput) {
                hiddenInput.value = JSON.stringify(matrixData);
            }
        });
    }
}

setupMatrixControls();