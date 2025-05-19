console.log("sendAndDownload.js loaded");

function downloadResult() {
    console.log("downloadResult called");
    const name = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const resultHTML = document.querySelector(".left-panel .content-block").innerHTML;

    if (!name || !email) {
        alert("Please enter your name and email.");
        return;
    }

    const postData = {
        name: name,
        email: email,
        result_html: resultHTML,
        date: new Date().toISOString()
    };

    console.log("Posting to /save_result", postData);
    fetch('/save_result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
    })
        .then(r => {
            console.log("save_result status", r.status);
            if (!r.ok) throw new Error(`Save failed (${r.status})`);
            return r.json();  // получаем массив записей текущего пользователя
        })
        .then(userEntries => {
            console.log("Received user entries", userEntries);
            // Превращаем полученный массив в JSON-файл и скачиваем
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
            console.error("Error in save/download chain:", err);
            alert("Error: " + err.message);
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
