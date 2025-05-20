function downloadResult() {
    const name = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const block = document.querySelector(".left-panel .content-block");

    if (!name || !email) {
        alert("Please ������� ��� � email.");
        return;
    }

    // ��������� email: ������ ���� �������� � ��������������� �������
    if (!email) {
        emailError.innerText = "Enter your email";
        valid = false;
    } else if (!validateEmail(email)) {
        emailError.innerText = "Enter a correct email";
        valid = false;
    }

    // ���� ��� ��� email ����������� � ����� �� �������
    if (!valid) return;

    // ������ ��� �������� ������ �����
    let graphMetricsObj = {};
    let foundMetrics = false;

    // ���� ��������� "Graph metrics:" � DOM-��������� �����
    for (const el of block.children) {
        if (el.tagName === "H3" && el.textContent.trim() === "Graph metrics:") {
            foundMetrics = true;
            continue; // ��������� � ���������� �������� � ������� ������ <ul>
        }

        if (foundMetrics) {
            // ��������� ���������� ������ ������
            if (el.tagName === "UL") {
                for (const li of el.querySelectorAll("li")) {
                    const text = li.textContent.trim(); // ������: "Graph density: 0.25"
                    const colonIndex = text.indexOf(":");
                    if (colonIndex === -1) continue; // ���������� ������ ��� ":" (������������)

                    const key = text.substring(0, colonIndex).trim();   // �������� �������
                    const val = text.substring(colonIndex + 1).trim();  // �������� �������

                    // ���� ������� � Degree per node, ��� JSON-������ ����: "0: 2, 1: 3"
                    if (key === "Degree per node") {
                        // ����������� � JSON: ��������� ������� � ������
                        const jsonReady = val.replace(/(\d+)\s*:/g, '"$1":');
                        try {
                            graphMetricsObj[key] = JSON.parse(jsonReady);
                        } catch (e) {
                            console.warn("Failed to parse Degree per node:", e);
                            graphMetricsObj[key] = val;
                        }
                    }
                    // ���� ������� �������� � ������ � float
                    else if (key === "Graph density" || key === "Average clustering coefficient") {
                        graphMetricsObj[key] = parseFloat(val);
                    }
                    // ��� ��������� ������� � ��������� ��� ������
                    else {
                        graphMetricsObj[key] = val;
                    }
                }
                break; // ��������� ��������� ������
            }
            // ���� ����� ��������� ����� ��� ������ ������� (�� <ul>), ���������
            else if (el.tagName !== "UL" && el.textContent.trim() !== "") {
                break;
            }
        }
    }

    // ���� ������� ��� � �� ���� ������� � �������������� � �����
    if (!foundMetrics) {
        alert("Graph metrics �� �������.");
        return;
    }

    // ���������� ������ ��� �������� �� ������
    const postData = {
        algorithm: "Girvan Newman", // �������� ���������
        name: name,                 // ��� ������������
        email: email,               // Email ������������
        result: graphMetricsObj,    // ����������� ������� �����
        date: getLocalDateTimeString() // ���� � ����� ����������
    };

    // ���������� JSON �� ������ �� �������� /save_result
    fetch('/save_result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
    })
        .then(response => {
            if (!response.ok) throw new Error(`Save failed (${response.status})`);
            return response.json(); // �������� JSON � ������������
        })
        .then(userEntries => {
            // ����������� ��������� � ������ � ������ blob-����
            const jsonStr = JSON.stringify(userEntries, null, 2); // ������ � ���������
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // ������ ������ ��� ����������
            const a = document.createElement('a');
            a.href = url;
            a.download = `${email.replace(/[^a-z0-9]/gi, '_')}_results.json`;
            document.body.appendChild(a);
            a.click(); // ��������� ����������
            document.body.removeChild(a);

            // ������� ��������� URL
            URL.revokeObjectURL(url);
        })
        .catch(err => {
            console.error("Error in save/download:", err);
            alert("������: " + err.message); // ���������� ��������� �� ������
        });
}

// ��������� ���������� ������ "��������� ���������" ����� �������� ��������
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('save-btn');
    if (btn) {
        btn.addEventListener('click', downloadResult); // ����������� ����������
        console.log("Listener added to #save-btn");
    } else {
        console.warn("Button with ID #save-btn was not found");
    }
});
