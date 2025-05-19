% rebase('layout.tpl', title='Theory Page', year=year)

<div class="content fade-in">
    <h1>Learning path construction</h1>
    <div class="skip-theory">
        <h3>Don't want to learn the theory?</h3>
        <a href="#calculator">Go straight to the calculator &rarr;</a>
    </div>

    <div class="text-block">
        <h2>Introduction</h2>
        <p>When designing personalized education, it's important to consider dependencies between topics and their difficulty. We propose a method for constructing a learning path using a Directed Acyclic Graph (DAG), where nodes represent topics and edges represent prerequisites.</p>

        <h2>Core Concepts</h2>
        <h3>Educational Graph</h3>
        <ul>
            <li><strong>Topics (nodes):</strong> Individual learning modules or concepts</li>
            <li><strong>Dependencies (edges):</strong> Connections between topics (A ? B means A must be studied before B)</li>
            <li><strong>Topic difficulty:</strong> A numeric measure indicating the learning effort required</li>
        </ul>

        <h2>Learning Path Algorithm</h2>
        <h3>Topological Sorting with Difficulty Consideration</h3>
        <ol>
            <li><strong>Initialization:</strong>
                <ul>
                    <li>Calculate in-degrees for all nodes</li>
                    <li>Create a queue of topics with zero prerequisites</li>
                </ul>
            </li>
            <li><strong>Processing:</strong>
                <ul>
                    <li>Extract the topic with the lowest difficulty from the queue</li>
                    <li>Add it to the learning path</li>
                    <li>Reduce dependency count for connected topics</li>
                    <li>Add new zero-dependency topics to the queue</li>
                </ul>
            </li>
            <li><strong>Repeat:</strong> Until all topics are processed</li>
        </ol>

    <h3>Python Implementation</h3>
    <pre><code>def build_learning_path(graph):
        in_degree = {topic: 0 for topic in graph}
        queue = []
        path = []

        # Calculate in-degrees
        for topic in graph:
            for neighbor in graph[topic]["dependencies"]:
                in_degree[neighbor] += 1

        # Collect nodes with zero in-degree
        for topic, degree in in_degree.items():
            if degree == 0:
                queue.append(topic)

        # Sort queue by difficulty
        queue.sort(key=lambda t: graph[t]["difficulty"])

        while queue:
            current = queue.pop(0)
            path.append(current)

            for neighbor in graph[current]["dependencies"]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
                    queue.sort(key=lambda t: graph[t]["difficulty"])  # Keep sorted by difficulty

        return path

    # Example usage:
    graph = {
        "Programming Basics": {"difficulty": 2, "dependencies": ["Algorithms", "OOP"]},
        "Algorithms": {"difficulty": 3, "dependencies": ["Data Structures", "Sorting"]},
        "OOP": {"difficulty": 3, "dependencies": ["Design Patterns"]},
        "Data Structures": {"difficulty": 4, "dependencies": []},
        "Sorting": {"difficulty": 3, "dependencies": []},
        "Design Patterns": {"difficulty": 5, "dependencies": []},
    }

    path = build_learning_path(graph)
    print(path)

}</code></pre>

        <h2>Key Characteristics of the Path</h2>
        <ul>
            <li><strong>Total difficulty:</strong> Sum of difficulties of all topics</li>
            <li><strong>Peak load:</strong> Maximum difficulty among consecutive topics</li>
            <li><strong>Load balance:</strong> How evenly difficulty is distributed</li>
            <li><strong>Critical topics:</strong> Topics with the most dependencies</li>
        </ul>

        <h2>Relevant Topics</h2>
        <ul>
            <li>Topics with the highest number of outgoing connections (hubs)</li>
            <li>Topics that require many prerequisites</li>
            <li>Topics with high difficulty that influence many others</li>
        </ul>

        <h2>Practical Application</h2>
        <p>This method can be applied on your educational platform:</p>
        <ul>
            <li><strong>Input:</strong> Database of topics with difficulty scores and dependency matrix</li>
            <li><strong>Output:</strong> Personalized learning path</li>
            <li><strong>Features:</strong> Graph visualization, learning time estimation, progress-based adjustment</li>
        </ul>

        <h2>Example</h2>
        <p><strong>Topic Graph:</strong></p>
        <ul>
            <li>Programming Basics (difficulty 2) ? Algorithms (3) ? Data Structures (4)</li>
            <li>Programming Basics ? OOP (3)</li>
            <li>Algorithms ? Sorting (3)</li>
            <li>OOP ? Design Patterns (5)</li>
        </ul>
        <p><strong>Optimal Path:</strong></p>
        <ul>
            <li>Programming Basics (2)</li>
            <li>Algorithms (3) or OOP (3)</li>
            <li>Data Structures (4) or Sorting (3)</li>
            <li>Design Patterns (5)</li>
        </ul>

        <h2>Conclusion</h2>
        <p>This approach allows for creating effective educational trajectories considering both logical topic order and difficulty. It is especially useful for:</p>
        <ul>
            <li>Personalized learning</li>
            <li>Adaptive educational systems</li>
            <li>Curriculum planning</li>
        </ul>
    </div>
</div>

<hr>

<div class="content" id="calculator">
    <div class="text-block">
        <h2>Upload Your Topic Graph</h2>
        <p>To calculate a personalized learning path, upload a JSON file describing your topic graph. The file should include topics, their difficulties, and dependencies.</p>

        <form action="/EducationalTrajectoryTheoryDecision" method="post" enctype="multipart/form-data" class="form-block">
            <label for="graphFile"><strong>Choose a JSON file:</strong></label><br>
            <div class="file-upload">
                <input type="file" id="graphFile" name="graphFile" accept=".json">
                <button type="button" id="customFileButton" class="btn-file" onclick="document.getElementById('graphFile').click()">Select File</button>
                <span id="fileName" class="file-name">No file selected</span>
            </div>
            <p class="note">After uploading, the system will process your data and display a personalized learning trajectory based on your file.</p>
            <button type="submit" class="btn-calc">Calculate</button>
        </form>
    </div>
    </div>
</div>

<script src="/static/scripts/showFileName.js"></script>
