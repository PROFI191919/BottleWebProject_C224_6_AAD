// ���������� ��������� ��� �������� email-������
const emailPattern = /^(?=[a-zA-Z0-9])(?!.*\.\.)[a-zA-Z0-9_.-]{2,64}@(?=.{1,255}$)[a-zA-Z0-9-]+\.[a-zA-Z]{2,63}$/;

// ������� ��� �������� ���������� email
function validateEmail(email) {
    return emailPattern.test(email);
}

// ��������� ��������� ������ � ����� � ��������
function getLocalDateTimeString() {
    const now = new Date();
    return now.toLocaleString('ru-RU'); // ��������: "20.05.2025, 16:20:01"
}

// ������� ������� ��� ����� � �������� �����������
function downloadResult() {
    // �������� ���� ����� � �������� ��� ����������� ������
    const nameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    const nameError = document.getElementById("nameError");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    // ����� ������
    emailError.innerText = "";
    nameError.innerText = "";

    let valid = true;

    // �������� �����
    if (!name) {
        nameError.innerText = "Enter your name";
        valid = false;
    }

    // �������� email
    if (!email) {
        emailError.innerText = "Enter your email";
        valid = false;
    } else if (!validateEmail(email)) {
        emailError.innerText = "Enter a correct email";
        valid = false;
    }

    if (!valid) {
        return; // ����������, ���� ���� ������
    }

    // ���� ���� � ������������ (�����)
    const block = document.querySelector(".left-panel .content-block");
    if (!block) {
        alert("No data for save");
        return;
    }

    const usersData = {};  // ���� ����� ����������� �������� � ������������ �������������

    // �������� �� �������� ��������� �����
    for (const el of block.children) {
        // ������� ��������� (��������, User 1:)
        if (el.tagName === "H3" && el.textContent.includes(":")) {
            const user = el.textContent.replace(":", "").trim();

            // ���������� ��������� ���������
            if (user === "Graph metrics" || user === "Explanation") continue;

            const interestsP = el.nextElementSibling; // ���� ��������� �������� �������
            const recommendationsPre = interestsP?.nextElementSibling?.nextElementSibling; // ���� ������� ����� interestsP

            // ��������� �������� ������������
            // ������ ������ ������ ��� �������� ��������� ������������
            const interests = [];

            // ���������, ��� ������� interestsP ���������� � �������� ����� <p>
            if (interestsP && interestsP.tagName === "P") {
                // ���� � ������ �������� interestsP ������, ������������ � "List of interests: "
                // � ����������� ��, ��� ��� ����� ���� �����
                const match = interestsP.textContent.match(/List of interests: (.*)/);

                // ���� ���������� ������� � ����� �� ����� "The user has no interests."
                if (match && match[1] !== "The user has no interests.") {
                    // ��������� ������ ��������� �� �������, ������� ������� � ������� ��������
                    // � ��������� ���������� �������� � ������ interests
                    interests.push(...match[1].split(",").map(i => i.trim()));
                }
            }

            // ��������� ������������
            // ������ ������ ������ ��� �������� ������������ ������������
            const recommendations = [];

            // ���������, ��� ������� recommendationsPre ���������� � �������� ����� <pre>
            if (recommendationsPre && recommendationsPre.tagName === "PRE") {
                // �������� ��������� ���������� �������� � ��������� ��� �� ������ �� ������� ����� ������
                // ����� ��������� ������ ������, �������� ������ ��������
                const lines = recommendationsPre.textContent.split("\n").filter(Boolean);

                for (const line of lines) {
                    // ����
                    // 1. ������ �������� (�������� ��������) - ����������� �������� ������������������ �� ������� �������
                    // 2. ���� ��� ��������� ��������
                    // 3. ������ ���� ��� ����� (������ / �������)
                    const parts = line.trim().match(/^(.+?)\s+([\d.]+)$/);

                    // ���� ���������� �������, ��������� ������ �� �������� �������� � ��� �������� �������
                    if (parts) {
                        // ��������� ������ � ��������� �������� � �������� ������� � ������ recommendations
                        recommendations.push({
                            item: parts[1].trim(), // �������� ��������, ������� �������
                            score: parseFloat(parts[2]) // ����������� � float
                        });
                    }
                }
            }

            // ��������� ������ ������������ � �������� ������
            usersData[user] = {
                interests: interests,
                recommendations: recommendations
            };
        }
    }

    // ���� ��� ������ �� � ������ ������������ � �������� �� ����
    if (Object.keys(usersData).length === 0) {
        alert("No data for saving");
        return;
    }

    // ���������� ����� �������
    const timestamp = Date.now();

    // �������������� ������ ��� ��������
    const postData = {
        email: email,
        name: name,
        date: getLocalDateTimeString(),
        recommendation_system: {
            [timestamp]: {
                data: usersData
            }
        }
    };

    // �������� ������ �� ������ ������� POST
    fetch('/save_result', {
        method: 'POST', // ����� ������� � POST (�������� ������)
        headers: { 'Content-Type': 'application/json' }, // ���������, ��� ���������� JSON
        body: JSON.stringify(postData) // ����������� ������ postData � ������ JSON
    })
        // ����� �������� ���� ����� �� ������� � ����������� ��� � JSON
        .then(response => response.json())
        .then(data => {
            // ���� ������ ������ ������, ������� � ������������
            if (data.error) {
                alert("Error: " + data.error);
            } else {
                // ���� �� ������ �������:
                // ������� ������ Blob �� ������ (� ��������� ��� ����������)
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

                // ������� ��������� ������ �� ����
                const url = URL.createObjectURL(blob);

                // ������� ������� <a> ��� ������� ����������
                const a = document.createElement('a');
                a.href = url;

                // �������� ����� � email_�_����������_�����_results.json
                // �������� ��� �������, ����� ��������� ���� � ����, �� �������������
                a.download = `${email.replace(/[^a-z0-9]/gi, '_')}_results.json`;

                // ���������� "�������" �� ������ � ��������� ����������
                a.click();

                // ������� ��������� URL �� ������
                URL.revokeObjectURL(url);
            }
        })
        // ��������� ������ ��� ������� (��������, ���� ����������)
        .catch(error => {
            console.error("Error in sending: ", error);
            alert("An error occurred while sending data"); // ��������� ������������
        });
}

// ��������� ���������� ������ "Save" ��� �������� ��������
document.addEventListener('DOMContentLoaded', () => {
    // ������� ������ "Save" �� ID
    const btn = document.getElementById('save-btn');

    // ��������� ���������� �����, ���� ������ �������
    if (btn) btn.addEventListener('click', downloadResult);
});
