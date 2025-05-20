from bottle import post, request, template
import json
import networkx as nx
import matplotlib.pyplot as plt
from datetime import datetime

# Обработчик POST-запроса на маршрут /DiscoveringCommunityUsingGirvanNewmanDecision
@post('/DiscoveringCommunityUsingGirvanNewmanDecision')
def girvan_newman_decision():
    # Получаем JSON-строку с матрицей смежности из формы (отправляется через JS/AJAX)
    matrix_json = request.forms.get('matrixData')
    if not matrix_json:
        return "Error: No matrix data provided."  # Если данных нет — возвращаем ошибку

    # Преобразуем JSON-строку в двумерный список (матрицу смежности)
    matrix = json.loads(matrix_json)

    # Создаём неориентированный граф (Graph, а не DiGraph) с помощью NetworkX
    G = nx.Graph()
    n = len(matrix)  # Количество вершин (размерность матрицы)

    # Добавляем рёбра в граф на основе матрицы смежности
    for i in range(n):
        for j in range(i + 1, n):  # Только верхняя треугольная часть, т.к. граф неориентированный
            weight = matrix[i][j]
            if weight != 0:  # Добавляем только рёбра с ненулевым весом
                G.add_edge(i, j, weight=weight)

    # Проверка: если граф не содержит рёбер — алгоритм не имеет смысла
    if G.number_of_edges() == 0:
        return "Error: The graph has no edges."

    # Запускаем алгоритм Гирвана–Ньюмана — генератор, который по шагам разбивает граф на сообщества
    communities_generator = nx.algorithms.community.girvan_newman(G)

    # Список для хранения разных уровней разбиения на сообщества
    levels = []
    try:
        for level in communities_generator:
            levels.append(level)
            # Прерываем, когда количество сообществ станет не меньше числа узлов (максимальное разбиение)
            if len(level) >= n:
                break
    except StopIteration:
        # Если не удалось разбить — создаём одно сообщество из всех узлов
        levels = [[set(G.nodes())]]

    # Формируем HTML-результат: список всех уровней разбиения
    result = "<h3>Detected community structures:</h3>"
    for step_idx, level in enumerate(levels, start=1):
        result += f"<p><b>Level {step_idx}:</b></p><ul>"
        for idx, community in enumerate(level, start=1):
            nodes_str = ', '.join(str(node) for node in sorted(community))  # Преобразуем множество в строку
            result += f"<li>Community {idx}: {nodes_str}</li>"
        result += "</ul>"

    # Для визуализации используем только первый уровень (наиболее "естественное" разбиение)
    top_level_communities = levels[0]

    # Создаём отображение: вершина → номер сообщества, чтобы раскрасить граф
    community_map = {}
    for idx, community in enumerate(top_level_communities):
        for node in community:
            community_map[node] = idx

    # Список цветов для каждой вершины на графе, соответствующий сообществу
    color_map = []
    for node in G.nodes():
        color_map.append(f"C{community_map.get(node, 0)}")  # Используем палитру matplotlib: C0, C1 и т.д.

    # Визуализируем граф с помощью matplotlib
    plt.figure(figsize=(8, 6))
    pos = nx.spring_layout(G, seed=42)  # Вычисляем координаты узлов (spring layout)
    nx.draw_networkx(
        G,
        pos,
        node_color=color_map,  # Цвета по сообществам
        with_labels=True,
        node_size=600,
        font_size=12
    )
    plt.title("Graph with detected communities")
    plt.axis('off')  # Убираем оси
    plt.tight_layout()
    plt.savefig('static/images/graph.png')  # Сохраняем изображение в папку static
    plt.close()  # Закрываем текущий график

    # Вычисляем основные метрики графа
    degree_dict = dict(G.degree())  # Степень каждой вершины
    density = nx.density(G)         # Плотность графа
    clustering = nx.average_clustering(G)  # Средний кластеризационный коэффициент по всем вершинам

    # Добавляем метрики в HTML-вывод
    result += "<h3>Graph metrics:</h3><ul>"
    result += f"<li><b>Degree per node:</b> {degree_dict}</li>"
    result += f"<li><b>Graph density:</b> {density:.3f}</li>"
    result += f"<li><b>Average clustering coefficient:</b> {clustering:.3f}</li>"
    result += "</ul>"

    # Текущий год (для подстановки в футер шаблона, например)
    year = datetime.now().year

    # Рендерим шаблон HTML, передаём результат, текущий год и URL
    return template('DiscoveringCommunityUsingGirvanNewmanDecision',
                    result=result,
                    year=year,
                    current_url='/DiscoveringCommunityUsingGirvanNewmanDecision')


def detect_communities_from_matrix(matrix):
    import networkx as nx

    G = nx.Graph()
    n = len(matrix)

    for i in range(n):
        for j in range(i + 1, n):
            weight = matrix[i][j]
            if weight != 0:
                G.add_edge(i, j, weight=weight)

    if G.number_of_edges() == 0:
        return []

    communities_generator = nx.algorithms.community.girvan_newman(G)

    try:
        first_level = next(communities_generator)
    except StopIteration:
        return [set(G.nodes())]

    return list(first_level)