% rebase('layout.tpl', title='Theory Page', year=year)

<div class="content fade-in">
    <h1>Discovering a Community using Girvan-Newman</h1>
    <div class="skip-theory">
        <h3>Don't want to learn the theory?</h3>
        <a href="#calculator">Go straight to the calculator &rarr;</a>
    </div>

    <div class="text-block">

        <h2>Community Analysis</h2>
        <p>Community analysis is an important task in graph theory, enabling the identification of groups of tightly connected nodes within a network. The Girvan-Newman algorithm is one of the classical methods for solving this task.</p>

        <h2>Key Concepts</h2>
        <h3>What is a Community in a Graph?</h3>
        <p>A community is a group of nodes that have more connections among themselves than with the rest of the network.</p>
        <ul>
            <li><strong>Modularity:</strong> a metric that measures the quality of community division (Q ? [-0.5, 1])</li>
            <li><strong>Inter-community edges:</strong> edges that connect different communities</li>
        </ul>

        <h2>Girvan-Newman Algorithm</h2>
        <h3>How it Works</h3>
        <p>This method is based on iteratively removing edges with the highest edge betweenness centrality.</p>
        <ol>
            <li>Calculate the betweenness of all edges</li>
            <li>Remove the edge with the highest betweenness</li>
            <li>Recalculate betweenness for the remaining edges</li>
            <li>Repeat until all edges are removed</li>
            <li>Select the partitioning with the highest modularity</li>
        </ol>

        <h3>Calculating Edge Betweenness</h3>
        <p>Edge betweenness is the number of shortest paths between all pairs of vertices that pass through that edge.</p>

        <pre><code>def edge_betweenness(graph):
    betweenness = dict.fromkeys(graph.edges(), 0)
    for node in graph.nodes():
        # Algorithm to find shortest paths from node
        # Count all paths and update betweenness
    return betweenness
</code></pre>

        <h2>Community Metrics</h2>
        <ul>
            <li><strong>Community Size:</strong> Number of nodes in the group</li>
            <li><strong>Edge Density:</strong> Ratio of actual edges to possible edges</li>
            <li><strong>Clustering Coefficient:</strong> Probability that a node's neighbors are connected</li>
            <li><strong>Modularity (Q):</strong> Quality of the division (optimal if Q &gt; 0.3)</li>
        </ul>

        <h3>Modularity Formula</h3>
        <p><strong>Q = &Sigma; [e<sub>ii</sub> - a<sub>i</sub><sup>2</sup>]</strong></p>
        <p>where:</p>
        <ul>
            <li><em>e<sub>i,i</sub></em> - fraction of edges inside community i</li>
            <li><em>a<sub>i</sub></em> - fraction of edges connected to community i</li>
        </ul>


        <h2>Practical Application</h2>
        <p><strong>Using on your site</strong></p>
        <ul>
            <li>Input data: adjacency matrix of the graph</li>
            <li>Visualization:
                <ul>
                    <li>Stepwise edge removal</li>
                    <li>Community formation</li>
                    <li>Modularity change graph</li>
                </ul>
            </li>
            <li>Results:
                <ul>
                    <li>List of detected communities</li>
                    <li>Statistics for each community</li>
                    <li>Optimal partitioning</li>
                </ul>
            </li>
        </ul>

        <h2>Example</h2>
        <p><strong>Initial Graph:</strong></p>
        <div class="image-container-theory">
            <img src="/static/images/GraphGirvanNewman.png" alt="Graph Example">
        </div>


        <p><strong>Execution Process:</strong></p>
        <ul>
            <li>The edges B-C and E-B have the highest betweenness</li>
            <li>After removing them, two communities form: {A, B, E} and {C, D, F}</li>
            <li>Maximum modularity is reached at this partitioning (Q = 0.45)</li>
        </ul>

        <h2>Implementation Details</h2>
        <h3>Optimizations</h3>
        <ul>
            <li>Recalculate betweenness only for affected components</li>
            <li>Use approximate algorithms for large graphs</li>
            <li>Cache intermediate results</li>
        </ul>

        <h3>Limitations</h3>
        <ul>
            <li>High computational complexity O(m<sup>2</sup>n) for a graph with n nodes and m edges</li>
            <li>Not suitable for very large networks (&gt;10<sup>5</sup> nodes)</li>
            <li>Sensitivity to "bridge" edges between communities</li>
        </ul>

        <h2>Conclusion</h2>
        <p>The Girvan-Newman algorithm provides an effective way to detect communities in medium-sized networks. On your educational website, it can be used for:</p>
        <ul>
            <li>Analyzing social connections between users</li>
            <li>Grouping similar learning materials</li>
            <li>Identifying thematic clusters in data</li>
            <li>Visualizing the structure of complex networks</li>
        </ul>
        <p>For practical use, it is recommended to:</p>
        <ul>
            <li>Use libraries such as NetworkX or igraph</li>
            <li>Visualize the partitioning process</li>
            <li>Provide users with interfaces to configure parameters</li>
        </ul>
    </div>
</div>

<hr>

<div class="content" id="calculator">
  <div class="text-block">
    <h2>Enter Graph Data</h2>
    <p>Set the size of the adjacency matrix and specify connections between nodes by checking the boxes. The graph is undirected, so the matrix is symmetric.</p>

    <form id="nodeCountForm" class="node-count-form">

      <div class="input-row" style="display: flex; align-items: center; gap: 10px;">
        <label for="nodeCount"><strong>Size (n):</strong></label>
        <input type="number" id="nodeCount" name="nodeCount" min="1" max="10" value="4" style="width: 60px;">
      </div>

      <span id="nodeCountError" class="error-message" style="display:none; margin-top: 5px;"></span>

      <div class="buttons-row" style="margin-top: 10px; display: flex; gap: 10px;">
        <button type="button" id="createEmptyMatrixBtn" class="btn-calc">Generate</button>
        <button type="button" id="fillRandomBtn" class="btn-calc">Fill Random</button>
      </div>
    </form>

    <form id="adjacencyMatrixForm" method="post" action="/DiscoveringCommunityUsingGirvanNewmanDecision" class="matrix-form">
      <div id="matrixContainer"></div>
      <input type="hidden" id="matrixData" name="matrixData" value="">
      <button type="submit" class="btn-calc">Calculate</button>
    </form>
  </div>
</div>


<script src="/static/scripts/girvan-newman.js"></script>