def get_recommendations(user, model, interests_matrix, n_neighbors=3):
    distances, indices = model.kneighbors(interests_matrix.loc[[user]], n_neighbors=n_neighbors)
    similar_users = interests_matrix.index[indices.flatten()]
    similar_ratings = interests_matrix.loc[similar_users]
    user_ratings = interests_matrix.loc[user]
    recommendations = similar_ratings.mean(axis=0).loc[user_ratings == 0]
    return recommendations.sort_values(ascending=False)