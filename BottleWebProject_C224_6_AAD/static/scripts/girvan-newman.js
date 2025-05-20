// ������� ��� �������� ������� ��������� (n x n) � DOM
// ���� fillRandom = true, ������� ����� ��������� ���������� ���������� (����� ����/���)
function createMatrix(n, fillRandom = false) {
    const container = document.getElementById("matrixContainer");
    container.innerHTML = "";  // ������� ��������� ����� ��������� ����� �������

    const table = document.createElement("table");

    // ������� ��������� ������ (����� �������)
    const headerRow = document.createElement("tr");
    headerRow.appendChild(document.createElement("th")); // ������ ����

    // ��������� ��������� �������� V1, V2, ..., Vn
    for (let i = 0; i < n; i++) {
        const th = document.createElement("th");
        th.textContent = `V${i + 1}`;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // ������� ������ ������� n x n � �������� ����������
    const matrix = Array.from({ length: n }, () => Array(n).fill(false));

    // ���� ������� ����� ��������� ���������, ��������� ������� ����������� �����
    if (fillRandom) {
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const val = Math.random() < 0.5;  // � ������������ 50% ������ �����
                matrix[i][j] = val;
                matrix[j][i] = val;  // ������������ ��������� (���� �����������������)
            }
        }
    }

    // ��������� ������� �� �������
    for (let i = 0; i < n; i++) {
        const row = document.createElement("tr");

        // ��������� ������ (V1, V2 � �.�.)
        const rowHeader = document.createElement("th");
        rowHeader.textContent = `V${i + 1}`;
        row.appendChild(rowHeader);

        // ������ ������
        for (let j = 0; j < n; j++) {
            const cell = document.createElement("td");

            if (i === j) {
                // ��������� � ��������� �����: ��������� �������
                const disabledBox = document.createElement("input");
                disabledBox.type = "checkbox";
                disabledBox.disabled = true;
                disabledBox.checked = false;
                disabledBox.style.opacity = "0.4";          // ��������� ���������
                disabledBox.style.pointerEvents = "none";   // ��������� ��������������
                cell.appendChild(disabledBox);
            } else {
                // ������� ��� ��������� ����� (����� ����� ��������� i � j)
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = `matrix[${i}][${j}]`;
                checkbox.style.width = "20px";
                checkbox.style.height = "20px";
                checkbox.checked = matrix[i][j];  // ������������� ���������

                // ��������� ���������: ��� ��������� ��������� � �������� ��� � ���������� ������
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

    // ��������� ����������� ������� � DOM
    container.appendChild(table);
}

// ����������� �������� ����������: ��������� �������, ���������, �������� �����
function setupMatrixControls() {
    const createBtn = document.getElementById("createEmptyMatrixBtn");
    const randomBtn = document.getElementById("fillRandomBtn");
    const nodeCountInput = document.getElementById("nodeCount");
    const nodeCountError = document.getElementById("nodeCountError");

    // �������� ������������ ���������� ���������� �����
    function validateN() {
        const n = Number(nodeCountInput.value);
        if (!Number.isInteger(n) || n < 2 || n > 10) {
            // ������, ���� ������� ������������ ��������
            nodeCountError.textContent = "Please enter an integer between 2 and 10.";
            nodeCountError.style.display = "block";
            console.warn("Invalid node count entered.");
            return null;
        }
        // ���� �� ������, �������� ��������� �� ������
        nodeCountError.textContent = "";
        nodeCountError.style.display = "none";
        return n;
    }

    // ���������� ������ "������� ������ �������"
    createBtn.addEventListener("click", () => {
        const n = validateN();
        if (n !== null) {
            console.log("Creating empty matrix with", n, "nodes");
            createMatrix(n, false);
        }
    });

    // ���������� ������ "��������� ��������"
    randomBtn.addEventListener("click", () => {
        const n = validateN();
        if (n !== null) {
            console.log("Creating random matrix with", n, "nodes");
            createMatrix(n, true);
        }
    });

    // ��� �������� �������� ������ ������� 4x4 �� ���������
    window.addEventListener("DOMContentLoaded", () => {
        console.log("Page loaded � generating default matrix (4x4)");
        createMatrix(4, false);
    });

    // ��������� ����� � ����������� ��������� ��������� � ������� � ����������� � JSON
    const form = document.getElementById("adjacencyMatrixForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            const n = Number(nodeCountInput.value);
            const matrixData = [];

            let hasEdge = false;  // ���� � ���� �� ���� �� ���� �����

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
                // ���� ��� ������ ����� � �� ���������� �����
                e.preventDefault();
                matrixError.textContent = "Please select at least one edge in the matrix.";
                matrixError.style.display = "block";
                console.warn("Empty adjacency matrix submitted");
                return;
            } else {
                matrixError.textContent = "";
                matrixError.style.display = "none";
            }

            // ��������� JSON � ������� ����, ������� ����� ���������� �� ������
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

// ��������� ��������� ��� �������� �������
setupMatrixControls();
