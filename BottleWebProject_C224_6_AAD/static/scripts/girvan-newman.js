document.addEventListener('DOMContentLoaded', function () {
    const nodeCountForm = document.getElementById('nodeCountForm');
    const createMatrixBtn = document.getElementById('createMatrixBtn');
    const adjacencyMatrixForm = document.getElementById('adjacencyMatrixForm');
    const matrixContainer = document.getElementById('matrixContainer');
    const changeMatrixSizeBtn = document.getElementById('changeMatrixSize');
    const calculationForm = document.getElementById('calculationForm');

    createMatrixBtn.addEventListener('click', function () {
        const n = parseInt(document.getElementById('nodeCount').value);
        if (isNaN(n) || n < 1 || n > 100) {
            alert('Please enter a valid number of nodes between 1 and 100.');
            return;
        }

        nodeCountForm.style.display = 'none';
        adjacencyMatrixForm.style.display = 'block';
        createMatrix(n);
    });

    function createMatrix(n) {
        matrixContainer.innerHTML = '';

        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.margin = '20px 0';

        const headerRow = document.createElement('tr');
        headerRow.appendChild(document.createElement('th'));
        for (let j = 0; j < n; j++) {
            const th = document.createElement('th');
            th.textContent = j + 1;
            th.style.border = '1px solid #000';
            th.style.padding = '8px';
            th.style.textAlign = 'center';
            headerRow.appendChild(th);
        }
        table.appendChild(headerRow);

        const matrixData = Array.from({ length: n }, () => Array(n).fill(0));

        for (let i = 0; i < n; i++) {
            const row = document.createElement('tr');

            const rowHeader = document.createElement('th');
            rowHeader.textContent = i + 1;
            rowHeader.style.border = '1px solid #000';
            rowHeader.style.padding = '8px';
            rowHeader.style.textAlign = 'center';
            row.appendChild(rowHeader);

            for (let j = 0; j < n; j++) {
                const cell = document.createElement('td');
                cell.style.border = '1px solid #000';
                cell.style.padding = '5px';
                cell.style.textAlign = 'center';

                if (i === j) {
                    cell.textContent = '0';
                    cell.style.backgroundColor = '#f0f0f0';
                } else if (j < i) {
                    cell.textContent = matrixData[j][i] ? '1' : '0';
                    cell.style.backgroundColor = '#f8f8f8';
                } else {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = `edge_${i}_${j}`;
                    checkbox.value = '1';
                    checkbox.checked = matrixData[i][j] === 1;
                    checkbox.dataset.row = i;
                    checkbox.dataset.col = j;

                    checkbox.addEventListener('change', function () {
                        const row = parseInt(this.dataset.row);
                        const col = parseInt(this.dataset.col);
                        matrixData[row][col] = this.checked ? 1 : 0;
                        matrixData[col][row] = matrixData[row][col]; 

                        const mirroredCell = table.rows[col + 1].cells[row + 1];
                        mirroredCell.textContent = matrixData[col][row] ? '1' : '0';
                    });

                    cell.appendChild(checkbox);
                }
                row.appendChild(cell);
            }
            table.appendChild(row);
        }

        matrixContainer.appendChild(table);
    }

    changeMatrixSizeBtn.addEventListener('click', function () {
        nodeCountForm.style.display = 'block';
        adjacencyMatrixForm.style.display = 'none';
        document.getElementById('nodeCount').value = '';
        matrixContainer.innerHTML = '';
    });

    calculationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        this.submit();
    });
});