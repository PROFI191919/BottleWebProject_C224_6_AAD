<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }} - My Bottle Application</title>
    <link rel="stylesheet" type="text/css" href="/static/content/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="/static/styles/sidebar.css" />
    <script src="/static/scripts/modernizr-2.6.2.js"></script>
</head>

<body>
<div class="sidebar">
    <div class="sidebar-header">
        <h2>Application name</h2>
    </div>
    <ul class="sidebar-menu">
        <li><a href="/home">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</div>

<div class="content">
    {{!base}}
    <hr />
    <footer>
        <p>&copy; {{ year }} - My Bottle Application</p>
    </footer>
</div>

<script src="/static/scripts/jquery-1.10.2.js"></script>
<script src="/static/scripts/bootstrap.js"></script>
<script src="/static/scripts/respond.js"></script>

</body>
</html>
