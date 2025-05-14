<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Analytics Dashboard</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
    }

    /* Горизонтальный синий бордер */
    .top-bar {
      background-color: #1e40af; /* насыщенный синий */
      color: white;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .top-bar h1 {
      margin: 0;
      font-size: 1.2rem;
    }

    .main-content {
      display: flex;
      flex: 1;
    }

    .sidebar {
      background-color: #3b82f6; /* голубой оттенок */
      padding: 20px;
      width: 220px;
      color: white;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .sidebar button {
      background-color: #60a5fa;
      border: none;
      padding: 10px;
      color: white;
      cursor: pointer;
      text-align: left;
      border-radius: 5px;
    }

    .sidebar button:hover {
      background-color: #2563eb;
    }

    .content {
      flex: 1;
      padding: 20px;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .chart {
      background-color: #f3f4f6;
      padding: 10px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
    }

    .chart-title {
      font-weight: bold;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>

  <div class="top-bar">
    <h1>Crypto Analytics Dashboard</h1>
    <div>User Menu</div>
  </div>

  <div class="main-content">
    <div class="sidebar">
      <button>Home</button>
      <button>Financial Reports</button>
      <button>Performance Trends</button>
      <button>Security Status</button>
      <button>Settings</button>
    </div>

    <div class="content">
      <h2>Statistics Overview</h2>
      <div class="charts-grid">
        <div class="chart">
          <div class="chart-title">Chart A</div>
          <canvas id="chartA"></canvas>
        </div>
        <div class="chart">
          <div class="chart-title">Chart B</div>
          <canvas id="chartB"></canvas>
        </div>
        <div class="chart">
          <div class="chart-title">Chart C</div>
          <canvas id="chartC"></canvas>
        </div>
        <div class="chart">
          <div class="chart-title">Chart D</div>
          <canvas id="chartD"></canvas>
        </div>
      </div>
    </div>
  </div>

</body>
</html>
