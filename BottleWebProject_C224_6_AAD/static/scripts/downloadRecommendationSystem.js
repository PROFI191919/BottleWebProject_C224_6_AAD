function downloadResult() {
    const name = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const block = document.querySelector(".left-panel .content-block");

    if (!name || !email) {
        alert("Please enter name and email");
        return;
    }

    let graphMetricsObj = {};
    let foundMetrics = false;

    for (const el of block.children) {
        if (el.tagName === "H3" && el.textContent.trim() === "Graph metrics:") {
            foundMetrics = true;
            continue;
        }

        if (foundMetrics && el.tagName === "UL") {
            for (const li of el.querySelectorAll("li")) {
                const text = li.textContent.trim();
                const colonIndex = text.indexOf(":");
                if (colonIndex === -1) continue;

                const key = text.substring(0, colonIndex).trim();
                const val = text.substring(colonIndex + 1).trim();

                // Сохраняем только нужные метрики
                if (key === "Is Bipartite") {
                    graphMetricsObj[key] = val;
                }
                else if (key === "Density" || key === "Clustering Coefficient (avg)") {
                    graphMetricsObj[key] = parseFloat(val);
                }
            }
            break;
        }
    }

    if (!foundMetrics) {
        alert("Graph metrics not found");
        return;
    }

    // Удаляем ненужные поля
    const { NodeDegrees, DegreeCentrality, ...filteredMetrics } = graphMetricsObj;

    const postData = {
        name: name,
        email: email,
        result: filteredMetrics,
        date: new Date().toISOString()
    };

    console.log("Final data to save:", postData);

    fetch('/save_result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
    })
        .then(response => response.json())
        .then(data => {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${email.replace(/[^a-z0-9]/gi, '_')}_results.json`;
            a.click();
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Save error: " + error.message);
        });
}


document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('save-btn');
    if (btn) btn.addEventListener('click', downloadResult);
});