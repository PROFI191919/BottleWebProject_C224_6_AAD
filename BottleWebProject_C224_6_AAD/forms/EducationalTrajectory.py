from bottle import post, request, template
import json
import os
import uuid
import networkx as nx
import matplotlib.pyplot as plt
from datetime import datetime
from bottle import post, request, template
import json

@post('/EducationalTrajectoryTheoryDecision')
def educational_trajectory_decision():
    try:
        upload = request.files.get('graphFile')
        if not upload:
            return template('EducationalTrajectoryTheory.tpl',
                            error_message="No file uploaded",
                            year=2025)
        file_data = upload.file.read().decode('utf-8')
        try:
            graph = json.loads(file_data)
        except Exception:
            return template('EducationalTrajectoryTheory.tpl',
                            error_message="Invalid JSON format!",
                            year=2025)

        # Проверка: файл должен быть объектом, а не массивом
        if not isinstance(graph, dict):
            return template('EducationalTrajectoryTheory.tpl',
                            error_message="File must be an object with topics as keys, not an array!",
                            year=2025)
        if not (2 <= len(graph) <= 7):
            return template('EducationalTrajectoryTheory.tpl',
                            error_message="Number of topics must be between 2 and 7.",
                            year=2025)
        for topic, info in graph.items():
            if (not isinstance(info, dict) or
                'difficulty' not in info or
                not isinstance(info['difficulty'], int) or
                'dependencies' not in info or
                not isinstance(info['dependencies'], list)):
                return template('EducationalTrajectoryTheory.tpl',
                                error_message=f"Wrong format for topic '{topic}': must have 'difficulty' (int) and 'dependencies' (list).",
                                year=2025)

        # (Здесь должна быть твоя обработка графа и построение пути...)
        result = "Your personalized learning trajectory will appear here."  # Пример
        return template('EducationalTrajectoryTheoryDecision.tpl',
                        result=result,
                        year=2025)

    except Exception as e:
        return template('EducationalTrajectoryTheory.tpl',
                        error_message=f"Server error: {str(e)}",
                        year=2025)
def build_learning_path(graph):
    in_degree = {topic: 0 for topic in graph}
    for topic in graph:
        for neighbor in graph[topic]["dependencies"]:
            in_degree[neighbor] += 1
    queue = [t for t in graph if in_degree[t] == 0]
    queue.sort(key=lambda t: graph[t]["difficulty"])
    path = []
    while queue:
        current = queue.pop(0)
        path.append(current)
        for neighbor in graph[current]["dependencies"]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                queue.sort(key=lambda t: graph[t]["difficulty"])
    return path

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
def save_graph_image(graph, path, static_dir='static/images'):
    import matplotlib.pyplot as plt
    import networkx as nx
    import os

    os.makedirs(static_dir, exist_ok=True)
    img_path = os.path.join(static_dir, "graph.png")

    # Сборка графа
    G = nx.DiGraph()
    for topic, info in graph.items():
        G.add_node(topic, difficulty=info['difficulty'])
        for dep in info['dependencies']:
            G.add_edge(dep, topic)

    # Определяем уровни (layers) для каждого узла (topological layout)
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

    # Группировка по слоям и расположение
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

    # Рисуем остальные рёбра фиолетовыми
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
    # Рисуем основной путь оранжевым
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

    # Рисуем прямоугольные узлы
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

    # Масштабирование
    x_vals, y_vals = zip(*pos.values())
    ax.set_xlim(min(x_vals) - node_width, max(x_vals) + node_width)
    ax.set_ylim(min(y_vals) - node_height, max(y_vals) + node_height)

    plt.tight_layout()
    plt.savefig(img_path, bbox_inches='tight')
    plt.close()
    return "graph.png"


def get_current_year():
    return datetime.now().year

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
    path = build_learning_path(graph)
    metrics = compute_metrics(graph, path)
    relevant = find_relevant_topics(graph)
    img_name = save_graph_image(graph, path)
    result = "<h3>Optimal Learning Path:</h3><ol>"
    for t in path:
        result += f"<li>{t} (Difficulty: {graph[t]['difficulty']})</li>"
    result += "</ol>"
    result += "<h3>Metrics:</h3><ul>"
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