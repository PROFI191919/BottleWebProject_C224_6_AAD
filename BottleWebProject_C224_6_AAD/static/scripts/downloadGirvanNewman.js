function downloadResult() {
    const name = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const block = document.querySelector(".left-panel .content-block");

    if (!name || !email) {
        alert("Please введите имя и email.");
        return;
    }

    let graphMetricsObj = {};

    // Флаг, что нашли заголовок Graph metrics:
    let foundMetrics = false;

    for (const el of block.children) {
        if (el.tagName === "H3" && el.textContent.trim() === "Graph metrics:") {
            foundMetrics = true;
            continue;
        }

        if (foundMetrics) {
            if (el.tagName === "UL") {
                for (const li of el.querySelectorAll("li")) {
                    const text = li.textContent.trim();
                    // Пример: "Degree per node: {0: 1, 2: 3, 1: 2, 3: 2}"
                    const colonIndex = text.indexOf(":");
                    if (colonIndex === -1) continue;

                    const key = text.substring(0, colonIndex).trim();
                    const val = text.substring(colonIndex + 1).trim();

                    if (key === "Degree per node") {
                        // Заменяем ключи (числа перед двоеточием) на строки в кавычках
                        const jsonReady = val.replace(/(\d+)\s*:/g, '"$1":');
                        try {
                            graphMetricsObj[key] = JSON.parse(jsonReady);
                        } catch (e) {
                            console.warn("Failed to parse Degree per node:", e);
                            graphMetricsObj[key] = val;
                        }
                    } else if (key === "Graph density" || key === "Average clustering coefficient") {
                        graphMetricsObj[key] = parseFloat(val);
                    } else {
                        graphMetricsObj[key] = val;
                    }
                }
                break; // закончили парсить метрики — выходим
            } else if (el.tagName !== "UL" && el.textContent.trim() !== "") {
                break; // если встретили что-то другое — прекращаем поиск
            }
        }
    }

    if (!foundMetrics) {
        alert("Graph metrics не найдены.");
        return;
    }

    const postData = {
        name: name,
        email: email,
        result: graphMetricsObj,
        date: new Date().toISOString()
    };

    fetch('/save_result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
    })
        .then(response => {
            if (!response.ok) throw new Error(`Save failed (${response.status})`);
            return response.json();
        })
        .then(userEntries => {
            const jsonStr = JSON.stringify(userEntries, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${email}_results.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        })
        .catch(err => {
            console.error("Error in save/download:", err);
            alert("Ошибка: " + err.message);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('save-btn');
    if (btn) {
        btn.addEventListener('click', downloadResult);
        console.log("Attached downloadResult to save-btn");
    } else {
        console.warn("save-btn not found");
    }
});
