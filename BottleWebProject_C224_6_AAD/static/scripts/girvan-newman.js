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

    if (createBtn && randomBtn) {
        createBtn.addEventListener("click", () => {
            const n = parseInt(document.getElementById("nodeCount").value);
            if (n >= 1 && n <= 10) {
                createMatrix(n, false);
            }
        });

        randomBtn.addEventListener("click", () => {
            const n = parseInt(document.getElementById("nodeCount").value);
            if (n >= 1 && n <= 10) {
                createMatrix(n, true);
            }
        });
    }

    window.addEventListener("DOMContentLoaded", () => {
        createMatrix(4, false);
    });
}

setupMatrixControls();