from bottle import post, request, template
import pandas as pd
from sklearn.neighbors import NearestNeighbors
import json
from datetime import datetime
import matplotlib.pyplot as plt
import networkx as nx
from networkx.algorithms import bipartite

@post('/CreatingRecommendationSystemDecision')
def handle_matrix():
    matrix_json = request.forms.get('matrixData')
    rating_list = json.loads(matrix_json)

    df = pd.DataFrame(rating_list)  # columns: user | item | rating
    interests_matrix = df.pivot(index='user', columns='item', values='rating').fillna(0)

    # Создание модели KNN (K Nearest Neighbors - К ближайших соседей)
    model = NearestNeighbors(metric='cosine', algorithm='brute')
    model.fit(interests_matrix)

    # Функция для получения рекомендаций
    def get_recommendations(user, n_neighbors=3):
        # Находим индексы похожих пользователей
        distances, indices = model.kneighbors(interests_matrix.loc[[user]], n_neighbors=n_neighbors)
        
        # Получаем оценки похожих пользователей
        similar_users = interests_matrix.index[indices.flatten()]
        similar_ratings = interests_matrix.loc[similar_users]

        # Считаем средние оценки для интересов, которые данный пользователь еще не оценил
        user_ratings = interests_matrix.loc[user]
        recommendations = similar_ratings.mean(axis=0).loc[user_ratings == 0]
        
        return recommendations.sort_values(ascending=False)

    full_output = ""
    for user in interests_matrix.index:
        # Интересы пользователя
        user_interests = interests_matrix.loc[user]
        user_actual_interests = [item for item, score in user_interests.items() if score > 0]
        
        full_output += f"<h3>{user}:</h3>"
        if user_actual_interests:
            full_output += f"<p><b>List of interests: </b> {', '.join(user_actual_interests)}</p>"
        else:
            full_output += "<p><b>List of interests: </b>The user has no interests.</p>"

        # Рекомендации
        recs = get_recommendations(user)
        if recs.empty:
            full_output += "<p><b>Recommendations:</b></p><p>There are no recommendations for this user.</p>"
        else:
            full_output += "<p><b>Recommendations:</b></p><pre>"
            for item, score in recs.items():
                full_output += f"{item:<11} {score:.1f}\n"
            full_output += "</pre>"
        full_output += "<hr>"

    # Метрики графа — текстом
    full_output += """
    <h3>Basic interest graph metrics:</h3>
    <ul>
        <li><b>Node degree</b>: number of connections (similar users or common interests).</li>
        <li><b>Centrality</b>: how connected a user is to others (e.g., via PageRank or degree centrality). </li>
        <li><b>Bipartite</b>: the graph can be divided into users and interests, with no overlaps.</li>
        <li><b>Graph density</b>: the ratio of the number of real connections to possible connections. </li>
        <li><b>Maximal pairwise connectivity</b>: the largest number of user-interest pairs without overlap.</li>
        <li><b>Clustering coefficient</b>: the degree to which users with common interests are also connected to each other.</li>
    </ul>
    <hr>
    """

    # Построение графа
    nd_users = list(interests_matrix.index)
    nd_interests = list(interests_matrix.columns)
    edge_list = [
        (user, interest)
        for user in nd_users
        for interest in nd_interests
        if interests_matrix.at[user, interest] > 0
    ]
    edges = {'Edges': edge_list} 

    # Сохраняем изображение графа, получаем метрики
    metrics_html = save_graph(nd_users, nd_interests, edges)
    full_output += metrics_html

    year = datetime.now().year
    return template('CreatingRecommendationSystemDecision',
                    result=full_output,
                    year=year,
                    current_url='/CreatingRecommendationSystemDecision')

def save_graph(nd_users, nd_interests, edges):
    plt.figure(figsize=(15, 10))
    G = nx.Graph()
    G.add_nodes_from(nd_users, bipartite=0)
    G.add_nodes_from(nd_interests, bipartite=1)
    G.add_edges_from(edges['Edges'])

    pos = nx.bipartite_layout(G, nd_users)
    nx.draw_networkx(G, pos, node_color='#d8ccf3', edge_color="#ccc", node_size=1500, font_size=24, width=2.5)

    plt.axis('off')
    plt.tight_layout()
    plt.savefig('static/images/graph.png', bbox_inches='tight')
    plt.close()

    # Рассчитываем метрики графа
    degree_dict = dict(G.degree())
    centrality = nx.degree_centrality(G)
    centrality = {node: round(score, 3) for node, score in centrality.items()}
    is_bipartite = nx.is_bipartite(G)
    density = nx.density(G)
    matching = nx.max_weight_matching(G, maxcardinality=True)
    clustering = nx.average_clustering(G)

    metrics_html = "<h3>Calculated graph metrics:</h3><ul>"
    metrics_html += f"<li><b>Degrees:</b> {degree_dict}</li>"
    metrics_html += f"<li><b>Degree Centrality:</b> {centrality}</li>"
    metrics_html += f"<li><b>Is Bipartite:</b> {is_bipartite}</li>"
    metrics_html += f"<li><b>Density:</b> {density:.3f}</li>"
    metrics_html += f"<li><b>Max Matching:</b> {list(matching)}</li>"
    metrics_html += f"<li><b>Clustering Coefficient (avg):</b> {clustering:.3f}</li>"
    metrics_html += "</ul>"

    return metrics_html