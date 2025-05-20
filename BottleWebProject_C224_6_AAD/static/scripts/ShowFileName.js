document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('graphFile');
    const fileNameDisplay = document.getElementById('fileName');
    const form = fileInput.closest('form');
    const calcButton = form.querySelector('.btn-calc');

    function setFileMessage(message, color) {
        fileNameDisplay.textContent = message;
        fileNameDisplay.style.color = color;
    }
function validateJsonGraph(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
        return "Invalid file format.";
    }
    const keys = Object.keys(obj);
    if (keys.length < 2 || keys.length > 7) {
        return "Number of topics must be between 2 and 7.";
    }
    for (const topic of keys) {
        const info = obj[topic];
        if (typeof info !== 'object' || Array.isArray(info)) {
            return "Invalid file format.";
        }
        if (!('difficulty' in info) || typeof info.difficulty !== 'number') {
            return "Invalid file format.";
        }
        if (!('dependencies' in info) || !Array.isArray(info.dependencies)) {
            return "Invalid file format.";
        }
        for (const dep of info.dependencies) {
            if (!(dep in obj)) {
                return `Dependency '${dep}' for topic '${topic}' does not exist in graph.`;
            }
        }
    }
    // --- Вот тут вставка проверки на цикл ---
    function hasCycle(graph) {
        function dfs(node, visited, recStack) {
            visited.add(node);
            recStack.add(node);
            for (const neighbor of graph[node].dependencies) {
                if (!(neighbor in graph)) continue;
                if (!visited.has(neighbor)) {
                    if (dfs(neighbor, visited, recStack)) return true;
                } else if (recStack.has(neighbor)) {
                    return true;
                }
            }
            recStack.delete(node);
            return false;
        }
        const visited = new Set();
        for (const node of Object.keys(graph)) {
            if (!visited.has(node)) {
                if (dfs(node, visited, new Set())) return true;
            }
        }
        return false;
    }
    if (hasCycle(obj)) {
        return "The dependency graph contains a cycle!";
    }
    // ---
    return ""; // valid
}

    if (fileInput && fileNameDisplay && calcButton) {
        fileInput.addEventListener('change', function () {
            setFileMessage("Validating file...", "gray");
            calcButton.disabled = true;

            if (!this.files[0]) {
                setFileMessage("No file selected", "black");
                calcButton.disabled = true;
                return;
            }

            const fileName = this.files[0].name;
            const reader = new FileReader();

            reader.onload = function(e) {
                let obj;
                try {
                    obj = JSON.parse(e.target.result);
                } catch (err) {
                    setFileMessage("Invalid file format.", "red");
                    calcButton.disabled = true;
                    return;
                }
                const error = validateJsonGraph(obj);
                if (error) {
                    setFileMessage(error, "red");
                    calcButton.disabled = true;
                } else {
                    setFileMessage("File is valid: " + fileName, "green");
                    calcButton.disabled = false;
                }
            };

            reader.onerror = function() {
                setFileMessage("Could not read file.", "red");
                calcButton.disabled = true;
            };

            reader.readAsText(this.files[0]);
        });
    }
});