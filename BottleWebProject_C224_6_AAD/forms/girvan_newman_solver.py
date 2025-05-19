from bottle import post, request, template
import json
import networkx as nx
import matplotlib.pyplot as plt
from datetime import datetime

@post('/DiscoveringCommunityUsingGirvanNewmanDecision')
def girvan_newman_decision():
    # Получаем JSON с матрицей смежности из формы
    matrix_json = request.forms.get('matrixData')
    if not matrix_json:
        return "Error: No matrix data provided."

    matrix = json.loads(matrix_json)  # ожидаем: список списков, квадратная матрица

    # Создаем граф из матрицы смежности
    G = nx.Graph()
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            weight = matrix[i][j]
            if weight != 0:
                G.add_edge(i, j, weight=weight)

    if G.number_of_edges() == 0:
        return "Error: The graph has no edges."

    # Запускаем алгоритм Гирвана-Ньюмана
    communities_generator = nx.algorithms.community.girvan_newman(G)

    # Получаем все уровни разбиения
    levels = []
    try:
        for level in communities_generator:
            levels.append(level)
            if len(level) >= n:  # максимум до разбиения на отдельные узлы
                break
    except StopIteration:
        levels = [[set(G.nodes())]]

    # Формируем текстовый вывод по уровням
    result = "<h3>Detected community structures:</h3>"
    for step_idx, level in enumerate(levels, start=1):
        result += f"<p><b>Level {step_idx}:</b></p><ul>"
        for idx, community in enumerate(level, start=1):
            nodes_str = ', '.join(str(node) for node in sorted(community))
            result += f"<li>Community {idx}: {nodes_str}</li>"
        result += "</ul>"

    # Для графа используем первое разбиение (Level 1)
    top_level_communities = levels[0]

    # Сохраняем граф с раскрашенными сообществами
    color_map = []
    community_map = {}
    for idx, community in enumerate(top_level_communities):
        for node in community:
            community_map[node] = idx

    plt.figure(figsize=(8, 6))
    pos = nx.spring_layout(G, seed=42)
    for node in G.nodes():
        color_map.append(f"C{community_map.get(node, 0)}")
    nx.draw_networkx(G, pos, node_color=color_map, with_labels=True, node_size=600, font_size=12)
    plt.title("Graph with detected communities")
    plt.axis('off')
    plt.tight_layout()
    plt.savefig('static/images/graph.png')
    plt.close()

    # Рассчитываем базовые метрики графа
    degree_dict = dict(G.degree())
    density = nx.density(G)
    clustering = nx.average_clustering(G)

    result += "<h3>Graph metrics:</h3><ul>"
    result += f"<li><b>Degree per node:</b> {degree_dict}</li>"
    result += f"<li><b>Graph density:</b> {density:.3f}</li>"
    result += f"<li><b>Average clustering coefficient:</b> {clustering:.3f}</li>"
    result += "</ul>"

    year = datetime.now().year

    return template('DiscoveringCommunityUsingGirvanNewmanDecision',
                    result=result,
                    year=year,
                    current_url='/DiscoveringCommunityUsingGirvanNewmanDecision')
