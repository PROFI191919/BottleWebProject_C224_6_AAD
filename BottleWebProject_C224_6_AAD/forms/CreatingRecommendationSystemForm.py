from bottle import post, request, template
import pandas as pd
from sklearn.neighbors import NearestNeighbors
import json
from datetime import datetime

@post('/CreatingRecommendationSystemDecision')
def handle_matrix():
    matrix_json = request.forms.get('matrixData')
    rating_list = json.loads(matrix_json)

    df = pd.DataFrame(rating_list)  # columns: user | item | rating
    interests_matrix = df.pivot(index='user', columns='item', values='rating').fillna(0)

    model = NearestNeighbors(metric='cosine', algorithm='brute')
    model.fit(interests_matrix)

    def get_recommendations(user, n_neighbors=3):
        distances, indices = model.kneighbors(interests_matrix.loc[[user]], n_neighbors=n_neighbors)
        similar_users = interests_matrix.index[indices.flatten()]
        similar_ratings = interests_matrix.loc[similar_users]
        user_ratings = interests_matrix.loc[user]
        recommendations = similar_ratings.mean(axis=0).loc[user_ratings == 0]
        return recommendations.sort_values(ascending=False)

    full_output = ""
    for user in interests_matrix.index:
        # Интересы пользователя
        user_interests = interests_matrix.loc[user]
        user_actual_interests = [item for item, score in user_interests.items() if score > 0]
        full_output += f"<h3>{user}:</h3><p><b>List of interests: </b>{', '.join(user_actual_interests)}</p>"

        # Рекомендации
        recs = get_recommendations(user)
        full_output += f"<p><b>Recommendations:</b></p><pre>"
        for item, score in recs.items():
            full_output += f"{item:<20} {score:.1f}\n"
        full_output += "</pre><hr>"

    # Метрики графа — текстом
    full_output += """
    <h3>Основные метрики графа интересов:</h3>
    <ul>
        <li><p><b>Степень узла</b>: количество связей (похожих пользователей или общих интересов).</p></li>
        <li><b>Центральность</b>: насколько пользователь связан с остальными (например, через PageRank или degree centrality).</li>
        <li><b>Двудольность</b>: граф можно разделить на пользователей и интересы, без пересечений.</li>
        <li><b>Плотность графа</b>: отношение количества реальных связей к возможным.</li>
        <li><b>Максимальное паросочетание</b>: наибольшее количество пар пользователь–интерес без перекрытия.</li>
        <li><b>Поток в сети</b>: оценка, как информация/интерес может «передаваться» между пользователями.</li>
        <li><b>Коэффициент кластеризации</b>: степень, с которой пользователи с общими интересами также связаны друг с другом.</li>
    </ul>
    """

    year = datetime.now().year
    return template('CreatingRecommendationSystemDecision', result=full_output, year=year, current_url='/CreatingRecommendationSystemDecision')
