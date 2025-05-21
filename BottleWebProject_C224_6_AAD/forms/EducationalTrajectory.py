from bottle import post, request, template
import json
import os
import uuid
import networkx as nx
import matplotlib.pyplot as plt
from datetime import datetime

# Строит оптимальный маршрут изучения тем (топологическая сортировка с приоритетом сложности)
def build_learning_path(graph):
    in_degree = {topic: 0 for topic in graph}
    for topic in graph:
        for dep in graph[topic]["dependencies"]:
            in_degree[topic] += 1
    queue = [t for t in graph if in_degree[t] == 0]
    queue.sort(key=lambda t: graph[t]["difficulty"])
    path = []
    while queue:
        current = queue.pop(0)
        path.append(current)
        for neighbor in graph:
            if current in graph[neighbor]["dependencies"]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
        queue.sort(key=lambda t: graph[t]["difficulty"])
    return path

def find_shortest_path(graph):
    G = nx.DiGraph()
    for topic in graph:
        G.add_node(topic)
    for topic, info in graph.items():
        for dep in info["dependencies"]:
            if dep not in graph:
                raise ValueError(f"Dependency '{dep}' is not defined in the graph")
            G.add_edge(dep, topic)

    sources = [n for n in G.nodes if G.in_degree(n) == 0]
    sinks = [n for n in G.nodes if G.out_degree(n) == 0]

    shortest = None
    for s in sources:
        for t in sinks:
            if s == t:
                continue  # пропускаем путь в самого себя
            try:
                path = nx.shortest_path(G, source=s, target=t)
                if shortest is None or len(path) < len(shortest):
                    shortest = path
            except nx.NetworkXNoPath:
                continue

    return shortest if shortest else []

# Вычисляет метрики маршрута: суммарную сложность, максимальную нагрузку и баланс нагрузки
def compute_metrics(graph, path):
    difficulties = [graph[t]["difficulty"] for t in path]
    total = sum(difficulties)
    peak = max(difficulties) if difficulties else 0
    mean = total / len(difficulties) if difficulties else 0
    variance = sum((d - mean) ** 2 for d in difficulties) / len(difficulties) if difficulties else 0
    load_balance = variance ** 0.5
    return {
        "total_difficulty": total,
        "peak_load": peak,
        "load_balance": load_balance
    }

# Находит ключевые (hubs) и бутылочные (bottlenecks) темы в графе
def find_relevant_topics(graph):
    out_counts = {t: len(data["dependencies"]) for t, data in graph.items()}
    hubs = sorted(out_counts, key=lambda t: out_counts[t], reverse=True)[:3]
    in_counts = {t: 0 for t in graph}
    for data in graph.values():
        for dep in data["dependencies"]:
            in_counts[dep] = in_counts.get(dep, 0) + 1
    bottlenecks = sorted(in_counts, key=lambda t: in_counts[t], reverse=True)[:3]
    return {
        "hubs": hubs,
        "bottlenecks": bottlenecks
    }

# Рисует и сохраняет картинку графа с маршрутным листом
def save_graph_image(graph, path, static_dir='static/images'):
    os.makedirs(static_dir, exist_ok=True)
    img_path = os.path.join(static_dir, "graph.png")

    # Сборка графа
    G = nx.DiGraph()
    for topic, info in graph.items():
        G.add_node(topic, difficulty=info['difficulty'])
        for dep in info['dependencies']:
            G.add_edge(dep, topic)

    # Определяет расположение узлов по слоям для визуализации
    in_degree = {node: 0 for node in G.nodes()}
    for u, v in G.edges():
        in_degree[v] += 1
    layers = {}
    current_layer_nodes = [n for n in G.nodes() if in_degree[n] == 0]
    layer_num = 0
    visited = set()
    while current_layer_nodes:
        next_layer_nodes = []
        for node in current_layer_nodes:
            if node not in visited:
                layers[node] = layer_num
                visited.add(node)
                for succ in G.successors(node):
                    if all(pred in visited for pred in G.predecessors(succ)):
                        next_layer_nodes.append(succ)
        layer_num += 1
        current_layer_nodes = list(set(next_layer_nodes))
    max_layer = max(layers.values()) if layers else 0
    for node in G.nodes():
        if node not in layers:
            layers[node] = max_layer + 1

    # Группирует темы по слоям для расстановки по осям
    layer_nodes = {}
    for node, lnum in layers.items():
        layer_nodes.setdefault(lnum, []).append(node)
    for lnum in layer_nodes:
        layer_nodes[lnum].sort(key=lambda n: graph[n]["difficulty"])

    pos = {}
    y_gap = 2.5
    x_gap = 4
    for lnum in sorted(layer_nodes.keys()):
        nodes_in_layer = layer_nodes[lnum]
        count = len(nodes_in_layer)
        y_start = (count - 1) * y_gap / 2
        for i, node in enumerate(nodes_in_layer):
            pos[node] = (lnum * x_gap, y_start - i * y_gap)

    plt.figure(figsize=(12, 10.6))
    ax = plt.gca()
    ax.set_axis_off()

    # Рисует рёбра графа
    path_edges = set(zip(path, path[1:]))
    other_edges = [e for e in G.edges() if e not in path_edges]
    nx.draw_networkx_edges(
        G, pos,
        edgelist=other_edges,
        edge_color='#8C66FF',
        width=2,
        arrows=True,
        arrowsize=40,
        arrowstyle='-|>',
        connectionstyle='arc3,rad=0.1',
        ax=ax,
    )
    # Рисует маршрут оранжевым
    if len(path) > 1:
        nx.draw_networkx_edges(
            G, pos,
            edgelist=list(path_edges),
            edge_color='orange',
            width=4,
            arrows=True,
            arrowsize=40,
            arrowstyle='-|>',
            connectionstyle='arc3,rad=0.0',
            ax=ax,
        )

    # Рисует прямоугольники для тем
    node_width = 3.2
    node_height = 0.5
    for node, (x, y) in pos.items():
        rect = plt.Rectangle(
            (x - node_width / 2, y - node_height / 2),
            node_width, node_height,
            facecolor='#E4E0FA',
            edgecolor='#2d1e4f',
            linewidth=2,
            zorder=3,
            joinstyle='round',
            capstyle='round'
        )
        ax.add_patch(rect)
        parts = node.split(' ', 1)
        if len(parts) == 2:
            title = parts[0] + '\n' + parts[1]
        else:
            title = node
        label = f"{title}\n(Difficulty: {graph[node]['difficulty']})"
        ax.text(
            x, y, label,
            ha='center', va='center',
            fontsize=15,
            color='#2d1e4f',
            fontweight='bold',
            zorder=4
        )

    # Масштабирует и сохраняет картинку графа
    x_vals, y_vals = zip(*pos.values())
    ax.set_xlim(min(x_vals) - node_width, max(x_vals) + node_width)
    ax.set_ylim(min(y_vals) - node_height, max(y_vals) + node_height)

    plt.tight_layout()
    plt.savefig(img_path, bbox_inches='tight')
    plt.close()
    return "graph.png"

# Возвращает текущий год (для подстановки в шаблон)
def get_current_year():
    return datetime.now().year

# Основной обработчик POST-запроса: принимает файл, строит кратчайший маршрут, считает метрики, формирует HTML-ответ
@post('/EducationalTrajectoryTheoryDecision')
def educational_trajectory_decision():
    upload = request.files.get('graphFile')
    if not upload:
        return template('EducationalTrajectoryTheoryDecision',
                        result='Ошибка: файл не выбран',
                        img_name='default.png',
                        year=get_current_year(),
                        current_url=request.path)
    try:
        graph = json.load(upload.file)
    except Exception as e:
        return template('EducationalTrajectoryTheoryDecision',
                        result=f'Ошибка при чтении файла: {e}',
                        img_name='default.png',
                        year=get_current_year(),
                        current_url=request.path)
    if not (2 <= len(graph) <= 7):
        return template('EducationalTrajectoryTheoryDecision',
                        result='Ошибка: число тем должно быть от 2 до 7.',
                        img_name='default.png',
                        year=get_current_year(),
                        current_url=request.path)
    # Кратчайший маршрут между первым и последним уровнями
    shortest_path = find_shortest_path(graph)
    metrics = compute_metrics(graph, shortest_path)
    relevant = find_relevant_topics(graph)
    img_name = save_graph_image(graph, shortest_path)
    result = "<h3>Shortest Path from Entry to Exit Topic:</h3>"
    if shortest_path:
        result += "<ol>"
        for t in shortest_path:
            result += f"<li>{t} (Difficulty: {graph[t]['difficulty']})</li>"
        result += "</ol>"
    else:
        result += "<p>Нет доступного маршрута между начальными и конечными темами.</p>"
    result += "<h3>Metrics (for the shortest path):</h3><ul>"
    result += f"<li>Total difficulty: {metrics['total_difficulty']}</li>"
    result += f"<li>Peak load: {metrics['peak_load']}</li>"
    result += f"<li>Load balance: {metrics['load_balance']:.2f}</li>"
    result += "</ul>"
    result += "<h3>Most Relevant Topics:</h3><ul>"
    result += f"<li>Key topics (hubs): {', '.join(relevant['hubs'])}</li>"
    result += f"<li>Bottleneck topics: {', '.join(relevant['bottlenecks'])}</li>"
    result += "</ul>"
    return template('EducationalTrajectoryTheoryDecision',
                    result=result,
                    img_name=img_name,
                    year=get_current_year(),
                    current_url=request.path)