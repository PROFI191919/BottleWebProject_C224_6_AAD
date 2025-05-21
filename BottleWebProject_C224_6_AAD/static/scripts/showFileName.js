document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы DOM для управления загрузкой и проверкой файла
    const fileInput = document.getElementById('graphFile');
    const fileNameDisplay = document.getElementById('fileName');
    const errorBlock = document.getElementById('graphError');
    const calculateBtn = document.getElementById('calculateBtn');

    // Обновляет отображаемое имя файла при выборе пользователем
    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', function () {
            if (fileInput.files.length > 0) {
                fileNameDisplay.textContent = fileInput.files[0].name;
            } else {
                fileNameDisplay.textContent = 'No file selected';
            }
        });
    }

    // Проверяет корректность файла и блокирует кнопку если есть ошибка
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
                    graph = JSON.parse(e.target.result); // Пытаемся распарсить JSON
                } catch {
                    errorBlock.textContent = "Invalid JSON format!";
                    calculateBtn.disabled = true;
                    return;
                }
                // Проверяем, что это объект, а не массив или null
                if (typeof graph !== "object" || Array.isArray(graph) || !graph) {
                    errorBlock.textContent = "Graph must be an object (not an array)";
                    calculateBtn.disabled = true;
                    return;
                }
                const topics = Object.keys(graph);
                // Проверка количества тем
                if (topics.length < 2 || topics.length > 7) {
                    errorBlock.textContent = "Number of topics must be between 2 and 7";
                    calculateBtn.disabled = true;
                    return;
                }
                // Проверка структуры каждой темы и их зависимостей
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
                // Проверка на цикл в графе (алгоритм DFS)
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
                // Если найден цикл — блокируем кнопку и выводим ошибку
                if (hasCycle(graph)) {
                    errorBlock.textContent = "The dependency graph contains a cycle! This format is not supported.";
                    calculateBtn.disabled = true;
                    return;
                }
                // Всё прошло успешно — убираем ошибку и разблокируем кнопку
                errorBlock.textContent = '';
                calculateBtn.disabled = false;
            };
            reader.readAsText(file); // Читаем файл как текст
        });
    }
});