function generateMatrix() {
    const m = parseInt(document.getElementById('numUsers').value);  // rows
    const n = parseInt(document.getElementById('numItems').value);  // columns
    const container = document.getElementById('tableContainer');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'styled-table';
    const headerRow = document.createElement('tr');

    const topLeft = document.createElement('th');
    topLeft.className = "header";
    topLeft.innerText = "Users \\ Items";
    headerRow.appendChild(topLeft);

    for (let j = 1; j <= n; j++) {
        const th = document.createElement('th');
        th.className = "header";
        th.innerText = `Item ${j}`;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    for (let i = 1; i <= m; i++) {
        const row = document.createElement('tr');
        const userCell = document.createElement('th');
        userCell.className = "header";
        userCell.innerText = `User ${i}`;
        row.appendChild(userCell);

        for (let j = 1; j <= n; j++) {
            const td = document.createElement('td');
            const select = document.createElement('select');
            select.style.padding = "5px";
            select.name = `rating_u${i}_i${j}`;

            for (let k = 0; k <= 5; k++) {
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

document.addEventListener("DOMContentLoaded", function () {
    generateMatrix();

    const form = document.getElementById('ratingMatrixForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            const selects = document.querySelectorAll('#tableContainer select');
            const data = [];

            selects.forEach(select => {
                const [u, i] = select.name.match(/\d+/g);
                data.push({
                    user: `User ${u}`,
                    item: `Item ${i}`,
                    rating: parseInt(select.value)
                });
            });

            document.getElementById('matrixData').value = JSON.stringify(data);
        });
    }
});