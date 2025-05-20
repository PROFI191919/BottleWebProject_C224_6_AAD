% rebase('layout.tpl', title='Theory Page', year=year)

<!-- Page Content Container -->
<div class="content fade-in">

    <!-- Button: Back to Theory -->
    <a href="/DiscoveringCommunityUsingGirvanNewmanTheory" class="btn-calc btn-back">&#8592; Back to Theory</a>

    <!-- Panel Wrapper -->
    <div class="panel-container">

        <!-- Left Panel: Textual Solution -->
        <div class="left-panel">
            <div class="content-block">
                <h2>Textual Solution</h2>
                {{!result}}
            </div>
        </div>

        <!-- Right Panel: Graph + Save Form -->
        <div class="right-panel">

            <!-- Section: Interest Graph -->
            <div class="content-block">
                <h2>Interest Graph</h2>
                <div id="graphs-container">
                    <img src="/static/images/graph.png" alt="Graph Image" class="img-decision"/>
                </div>
            </div>

            <!-- Section: Save Result Form -->
            <div class="col form-block">
                <div class="col-content">
                    <h2>Save Result</h2>
                    <hr>
                    <p>You can save the result of the analysis as a JSON file.</p>

                    <form action="/save_result" method="post" class="save-form">
                        <label for="username"><strong>Your Name:</strong></label><br>
                        <input type="text" id="username" name="username" placeholder="Enter your name"><br>
                        <span id="nameError" class="error-message"></span><br>

                        <!-- Field: Email -->
                        <label for="email"><strong>Email:</strong></label><br>
                        <input type="text" id="email" name="email" placeholder="Enter your email"><br>
                        <span id="emailError" class="error-message"></span><br>

                        <!-- Button: Save -->
                        <button type="button" id="save-btn" class="btn-save">Save Result</button>
                    </form>
                </div>

                </div>
            </div>
        </div>
    </div>
</div>

<!-- Script: Handle Download -->
<script src="/static/scripts/downloadGirvanNewman.js"></script>
