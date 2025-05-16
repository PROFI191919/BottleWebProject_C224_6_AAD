function generateMatrix() {
    const n = parseInt(document.getElementById('matrixSize').value);
    const container = document.getElementById('tableContainer');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'styled-table';
    const headerRow = document.createElement('tr');

    const topLeft = document.createElement('th');
    topLeft.className = "header";
    topLeft.innerText = "Items";
    headerRow.appendChild(topLeft);

    for (let i = 1; i <= n; i++) {
        const th = document.createElement('th');
        th.className = "header";
        th.innerText = `Item ${i}`;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    for (let i = 1; i <= n; i++) {
        const row = document.createElement('tr');
        const userCell = document.createElement('th');
        userCell.className = "header";
        userCell.innerText = `User ${i}`;
        row.appendChild(userCell);

        for (let j = 1; j <= n; j++) {
            const td = document.createElement('td');
            const select = document.createElement('select');
            select.style.padding = "5px";
            for (let k = 1; k <= 5; k++) {
                const option = document.createElement('option');
                option.value = k;
                option.innerText = k;
                select.appendChild(option);
            }
            td.appendChild(select);
            row.appendChild(td);
        }
        table.appendChild(row);
    }

    container.appendChild(table);
}

function fillRandom() {
    const selects = document.querySelectorAll('#tableContainer select');
    selects.forEach(select => {
        const randomValue = Math.floor(Math.random() * 5) + 1;
        select.value = randomValue;
    });
}

window.addEventListener("DOMContentLoaded", generateMatrix);
