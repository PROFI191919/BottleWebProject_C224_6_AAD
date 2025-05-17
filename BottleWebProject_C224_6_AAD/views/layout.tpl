<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }} - Graph Analysis</title>
    <link rel="stylesheet" type="text/css" href="/static/content/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="/static/styles/all_styles.css" />
    <script src="/static/scripts/modernizr-2.6.2.js"></script>
</head>

<body>
<div class="sidebar">
    <div class="sidebar-header">
        <h2>Graph Analysis</h2>
    </div>
    <ul class="sidebar-menu">
        <li><a href="/home" class="{{'active' if current_url == '/home' else ''}}">Home</a></li>
        <li><a href="/EducationalTrajectoryTheory" class="{{'active' if current_url == '/EducationalTrajectoryTheory' else ''}}">Educational trajectory</a></li>
        <li><a href="/CreatingRecommendationSystemTheory" class="{{'active' if current_url == '/CreatingRecommendationSystemTheory' else ''}}">Recommendation systems</a></li>
        <li><a href="/DiscoveringCommunityUsingGirvanNewmanTheory" class="{{'active' if current_url == '/DiscoveringCommunityUsingGirvanNewmanTheory' else ''}}">Community discovery</a></li>
        <li><a href="/about" class="{{'active' if current_url == '/about' else ''}}">About</a></li>
    </ul>
    <img src="/static/images/logo.png" alt="Logotip" class="sidebar-logo"/>
</div>

<div class="content">
    {{!base}}
    <hr />
    <footer>
        <p>&copy; {{ year }} - Graph Analysis</p>
    </footer>
</div>

<script src="/static/scripts/jquery-1.10.2.js"></script>
<script src="/static/scripts/bootstrap.js"></script>
<script src="/static/scripts/respond.js"></script>

</body>
</html>
