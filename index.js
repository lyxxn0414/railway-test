const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize table
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

app.get("/api/visit", async (req, res) => {
  try {
    await pool.query("INSERT INTO visits DEFAULT VALUES");
    const result = await pool.query("SELECT COUNT(*) as count FROM visits");
    res.json({
      totalVisits: result.rows[0].count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Railway Test</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #fff;
    }
    .card {
      background: rgba(255,255,255,0.07);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 20px;
      padding: 48px 40px;
      text-align: center;
      max-width: 420px;
      width: 90%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .logo {
      font-size: 48px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      background: linear-gradient(90deg, #a78bfa, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: rgba(255,255,255,0.5);
      font-size: 14px;
      margin-bottom: 32px;
    }
    .counter-wrapper {
      margin-bottom: 32px;
    }
    .counter-label {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: rgba(255,255,255,0.4);
      margin-bottom: 8px;
    }
    .counter {
      font-size: 64px;
      font-weight: 800;
      background: linear-gradient(90deg, #c084fc, #818cf8, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      transition: transform 0.2s;
    }
    .counter.bump { transform: scale(1.15); }
    .btn {
      background: linear-gradient(135deg, #7c3aed, #3b82f6);
      border: none;
      color: #fff;
      padding: 14px 36px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      box-shadow: 0 4px 15px rgba(124,58,237,0.4);
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(124,58,237,0.6);
    }
    .btn:active { transform: translateY(0); }
    .status {
      margin-top: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 13px;
      color: rgba(255,255,255,0.4);
    }
    .dot {
      width: 8px; height: 8px;
      background: #34d399;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🚂</div>
    <h1>Railway Test</h1>
    <p class="subtitle">Node.js + PostgreSQL on Railway</p>
    <div class="counter-wrapper">
      <div class="counter-label">Total Visits</div>
      <div class="counter" id="count">-</div>
    </div>
    <button class="btn" onclick="recordVisit()">Visit Again</button>
    <div class="status">
      <span class="dot"></span>
      <span>Connected to PostgreSQL</span>
    </div>
  </div>
  <script>
    async function recordVisit() {
      try {
        const res = await fetch('/api/visit');
        const data = await res.json();
        const el = document.getElementById('count');
        el.textContent = data.totalVisits;
        el.classList.add('bump');
        setTimeout(() => el.classList.remove('bump'), 200);
      } catch(e) {
        document.getElementById('count').textContent = 'Error';
      }
    }
    recordVisit();
  </script>
</body>
</html>`);
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

initDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
