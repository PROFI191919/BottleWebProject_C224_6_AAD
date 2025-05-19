% rebase('layout.tpl', title='Theory Page', year=year)

<div class="content fade-in">
    <a href="/DiscoveringCommunityUsingGirvanNewmanTheory" class="btn-calc btn-back">&#8592; Back to Theory</a>
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
                <div id="graphs-container">
                    <img src="/static/images/graph.png" alt="Graph Image" class="img-decision"/>
                </div>
            </div>
            <div class="col form-block">
                <div class="col-content">
                    <h2>Save Result</h2>
                    <hr>
                    <p>You can save the result of the analysis by entering your details below.</p>

                    <form class="save-form" id="saveForm" method="post" action="/save_result">
                        <label for="username"><strong>Your Name:</strong></label><br>
                        <input type="text" id="username" name="username" placeholder="Enter your name"><br>
                        <span id="usernameError" class="error-message"></span><br>

                        <label for="email"><strong>Email:</strong></label><br>
                        <input type="text" id="email" name="email" placeholder="Enter your email"><br>
                        <span id="emailError" class="error-message"></span><br>

                        <button type="submit" class="btn-save">Save Result</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="/static/scripts/validSaveForm.js"></script>