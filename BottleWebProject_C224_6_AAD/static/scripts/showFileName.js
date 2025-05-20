document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('graphFile');
    const fileNameDisplay = document.getElementById('fileName');
    const errorBlock = document.getElementById('graphError');
    const calculateBtn = document.getElementById('calculateBtn');

    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', function () {
            // Показываем имя выбранного файла или "No file selected"
            if (fileInput.files.length > 0) {
                fileNameDisplay.textContent = fileInput.files[0].name;
            } else {
                fileNameDisplay.textContent = 'No file selected';
            }
        });
    }

    if (fileInput && errorBlock && calculateBtn) {
        fileInput.addEventListener('change', function () {
            errorBlock.textContent = '';
            calculateBtn.disabled = false;
            if (!fileInput.files.length) {
                // Если файл сняли — обновляем надпись и снимаем блокировку
                fileNameDisplay.textContent = 'No file selected';
                calculateBtn.disabled = false;
                return;
            }
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                let graph;
                try {
                    graph = JSON.parse(e.target.result);
                } catch {
                    errorBlock.textContent = "Invalid JSON format!";
                    calculateBtn.disabled = true;
                    return;
                }
                // Проверка структуры
                if (typeof graph !== "object" || Array.isArray(graph) || !graph) {
                    errorBlock.textContent = "Graph must be an object (not an array)";
                    calculateBtn.disabled = true;
                    return;
                }
                const topics = Object.keys(graph);
                if (topics.length < 2 || topics.length > 7) {
                    errorBlock.textContent = "Number of topics must be between 2 and 7";
                    calculateBtn.disabled = true;
                    return;
                }
                for (const [topic, info] of Object.entries(graph)) {
                    if (typeof info !== "object" || Array.isArray(info) || !info) {
                        errorBlock.textContent = `Topic '${topic}' must be an object`;
                        calculateBtn.disabled = true;
                        return;
                    }
                    if (!("difficulty" in info) || typeof info.difficulty !== "number") {
                        errorBlock.textContent = `Topic '${topic}' must have a numeric 'difficulty' field`;
                        calculateBtn.disabled = true;
                        return;
                    }
                    if (!("dependencies" in info) || !Array.isArray(info.dependencies)) {
                        errorBlock.textContent = `Topic '${topic}' must have 'dependencies' as an array`;
                        calculateBtn.disabled = true;
                        return;
                    }
                    for (const dep of info.dependencies) {
                        if (!(dep in graph)) {
                            errorBlock.textContent = `Dependency '${dep}' for topic '${topic}' does not exist in graph`;
                            calculateBtn.disabled = true;
                            return;
                        }
                    }
                }
                // Проверка на цикл (DFS)
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
                if (hasCycle(graph)) {
                    errorBlock.textContent = "The dependency graph contains a cycle! This format is not supported.";
                    calculateBtn.disabled = true;
                    return;
                }
                // Всё хорошо
                errorBlock.textContent = '';
                calculateBtn.disabled = false;
            };
            reader.readAsText(file);
        });
    }
});