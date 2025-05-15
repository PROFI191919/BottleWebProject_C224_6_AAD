% rebase('layout.tpl', title='Recommendation Systems Theory', year=year)

<div class="content">
    <h1 class="topic-title">Recommendation Systems Based on Preference Graphs</h1>
</div>

<div class="content">
    <div class="text-block">

        <h2>Introduction</h2>
        <p>Recommendation systems help users discover relevant content or products. We examine an approach based on preference graphs, where connections between users and items reflect their interactions.</p>

        <h2>Key System Components</h2>
        <h3>Preference Graph</h3>
        <p>Graph structure with two node types:</p>
        <ul>
            <li><strong>Users:</strong> Represented as nodes</li>
            <li><strong>Items:</strong> Represented as nodes</li>
            <li><strong>Weighted edges:</strong> Ratings from 1 to 5</li>
            <li><strong>Interaction matrix:</strong> Sparse M?N matrix (M users ? N items)</li>
        </ul>

        <h3>Graph Example</h3>
        <pre>User1 --5--> ItemA
User1 --3--> ItemB
User2 --4--> ItemA
User3 --2--> ItemB</pre>

        <h2>Recommendation Generation</h2>
        <h3>1. Neighborhood Analysis</h3>
        <p>Collaborative filtering method:</p>
        <ol>
            <li>Find users with similar preferences</li>
            <li>Recommend items liked by "neighbors"</li>
        </ol>

        <pre><code>def find_similar_users(user_id, ratings_matrix, k=5):
    similarities = []
    for other_user in ratings_matrix:
        if other_user != user_id:
            sim = cosine_similarity(ratings_matrix[user_id], ratings_matrix[other_user])
            similarities.append((other_user, sim))
    return sorted(similarities, key=lambda x: x[1], reverse=True)[:k]</code></pre>

        <h3>2. Rating Prediction</h3>
        <p>For each user, predict ratings for unrated items:</p>
        <p><strong>predicted_rating = user_avg_rating + 
                  ?(similarity(u,v) ? (rating_v,i - avg_rating_v)) / 
                  ?|similarity(u,v)|</strong></p>

        <h3>3. Top-N Recommendations</h3>
        <pre><code>def generate_recommendations(user_id, model, n=5):
    predictions = []
    for item_id in all_items:
        if not user_rated_item(user_id, item_id):
            pred = model.predict(user_id, item_id)
            predictions.append((item_id, pred))
    return sorted(predictions, key=lambda x: x[1], reverse=True)[:n]</code></pre>

        <h2>Key Metrics</h2>
        <h3>Interest Graph Metrics</h3>
        <ul>
            <li><strong>Graph density:</strong> Ratio of existing ratings to possible ratings</li>
            <li><strong>Average rating:</strong> Overall satisfaction level</li>
            <li><strong>Degree distribution:</strong> Frequency of popular items</li>
            <li><strong>Clustering coefficient:</strong> Tendency to form communities</li>
        </ul>

        <h3>Recommendation Quality Metrics</h3>
        <ul>
            <li><strong>Precision@K:</strong> Relevant items proportion in top-K</li>
            <li><strong>Recall@K:</strong> Coverage of relevant items</li>
            <li><strong>RMSE:</strong> Rating prediction error</li>
            <li><strong>Coverage:</strong> Proportion of recommendable items</li>
        </ul>

        <h2>Identifying Relevant Recommendations</h2>
        <h3>Relevance Criteria</h3>
        <ul>
            <li>High predicted rating (>4.0)</li>
            <li>Popularity among similar users</li>
            <li>Novelty (item unknown to user)</li>
            <li>Diversity (not all from same category)</li>
        </ul>

        <h3>Recommendation Example</h3>
        <p>For User1 who rated:</p>
        <ul>
            <li>ItemA: 5</li>
            <li>ItemB: 3</li>
        </ul>
        <p>Top-3 recommendations:</p>
        <ol>
            <li>ItemC (predicted 4.8)</li>
            <li>ItemD (4.5)</li>
            <li>ItemE (4.3)</li>
        </ol>

        <h2>Practical Implementation</h2>
        <h3>Website Integration Steps</h3>
        <ol>
            <li><strong>Data collection:</strong> Logging user actions</li>
            <li><strong>Model building:</strong> Daily graph updates</li>
            <li><strong>Recommendation generation:</strong> Real-time or batch processing</li>
            <li><strong>Visualization:</strong> "Recommended for you" section</li>
        </ol>

        <h3>Optimizations</h3>
        <ul>
            <li>Sparse matrix utilization</li>
            <li>Incremental model updates</li>
            <li>A/B testing of algorithms</li>
        </ul>

        <h3>System Example</h3>
        <p>Input data:</p>
        <table>
            <tr><th>User</th><th>Item</th><th>Rating</th></tr>
            <tr><td>U1</td><td>I1</td><td>5</td></tr>
            <tr><td>U1</td><td>I2</td><td>3</td></tr>
            <tr><td>U2</td><td>I1</td><td>4</td></tr>
            <tr><td>U2</td><td>I3</td><td>2</td></tr>
        </table>
        <p>Recommendations for U1:</p>
        <ul>
            <li>I3 (based on similarity with U2)</li>
            <li>I4 (popular among all users)</li>
        </ul>

        <h2>Conclusion</h2>
        <p>The presented system enables:</p>
        <ul>
            <li>Content personalization for users</li>
            <li>Increased engagement and satisfaction</li>
            <li>Discovery of hidden behavior patterns</li>
        </ul>

        <p>For educational websites particularly useful for:</p>
        <ul>
            <li>Recommending learning materials</li>
            <li>Suggesting study topics</li>
            <li>Creating personalized learning paths</li>
        </ul>

        <h3>Future Development</h3>
        <ul>
            <li>Context awareness (time, device)</li>
            <li>Hybrid systems (content + collaborative filtering)</li>
            <li>Reinforcement learning for optimization</li>
        </ul>
    </div>
</div>
