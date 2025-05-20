const emailPattern = /^(?=[a-zA-Z0-9])(?!.*\.\.)[a-zA-Z0-9_.-]{2,64}@(?=.{1,255}$)[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

function validateEmail(email) {
    return emailPattern.test(email);
}

function downloadResult() {
    const nameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    const nameError = document.getElementById("nameError");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    // Сброс ошибок
    emailError.innerText = "";
    nameError.innerText = "";

    let valid = true;

    if (!name) {
        nameError.innerText = "Enter your name";
        valid = false;
    }

    if (!email) {
        emailError.innerText = "Enter your email";
        valid = false;
    } else if (!validateEmail(email)) {
        emailError.innerText = "Enter a correct email";
        valid = false;
    }

    if (!valid) {
        return; // Прекращаем, если есть ошибки
    }

    const block = document.querySelector(".left-panel .content-block");
    if (!block) {
        alert("No data for save");
        return;
    }

    const usersData = {};
    for (const el of block.children) {
        if (el.tagName === "H3" && el.textContent.includes(":")) {
            const user = el.textContent.replace(":", "").trim();

            if (user === "Graph metrics" || user === "Explanation") continue;

            const interestsP = el.nextElementSibling;
            const recommendationsPre = interestsP?.nextElementSibling?.nextElementSibling;

            const interests = [];
            if (interestsP && interestsP.tagName === "P") {
                const match = interestsP.textContent.match(/List of interests: (.*)/);
                if (match && match[1] !== "The user has no interests.") {
                    interests.push(...match[1].split(",").map(i => i.trim()));
                }
            }

            const recommendations = [];
            if (recommendationsPre && recommendationsPre.tagName === "PRE") {
                const lines = recommendationsPre.textContent.split("\n").filter(Boolean);
                for (const line of lines) {
                    const parts = line.trim().match(/^(.+?)\s+([\d.]+)$/);
                    if (parts) {
                        recommendations.push({
                            item: parts[1].trim(),
                            score: parseFloat(parts[2])
                        });
                    }
                }
            }

            usersData[user] = {
                interests: interests,
                recommendations: recommendations
            };
        }
    }

    if (Object.keys(usersData).length === 0) {
        alert("Нет данных для сохранения");
        return;
    }

    const timestamp = Date.now();

    const postData = {
        email: email,
        name: name,
        date: new Date().toISOString(),
        recommendation_system: {
            [timestamp]: usersData
        }
    };

    fetch('/save_result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Ошибка: " + data.error);
            } else {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${email.replace(/[^a-z0-9]/gi, '_')}_results.json`;
                a.click();
                URL.revokeObjectURL(url);
            }
        })
        .catch(error => {
            console.error("Ошибка при отправке:", error);
            alert("Произошла ошибка при отправке данных");
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('save-btn');
    if (btn) btn.addEventListener('click', downloadResult);
});
