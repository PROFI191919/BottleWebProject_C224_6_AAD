% rebase('layout.tpl', title='Theory Page', year=year)

<div class="content fade-in">
    <a href="/EducationalTrajectoryTheory" class="btn-calc  btn-back">&#8592; Back to Theory</a>
    <div class="panel-container">
        <div class="left-panel">
            <div class="content-block">
                <h2>Textual Solution</h2>
                {{!result}}
            </div>
        </div>
        <div class="right-panel">
            <div class="content-block">
                <h2>Interest Graph</h2>
                <img src="/static/images/graph.png" alt="Graph Image" class="img-decision"/>
            </div>
            <div class="col form-block">
                <div class="col-content">
                    <h2>Save Result</h2>
                    <hr>
                    <p>You can save the result of the analysis by entering your details below.</p>

                    <form action="/save_result" method="post" class="save-form">
                        <label for="username"><strong>Your Name:</strong></label><br>
                        <input type="text" id="username" name="username" placeholder="Enter your name" required><br>

                        <label for="email"><strong>Email:</strong></label><br>
                        <input type="email" id="email" name="email" placeholder="Enter your email" required><br>

                        <button type="submit" class="btn-save">Save Result</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>