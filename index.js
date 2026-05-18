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

app.get("/", async (req, res) => {
  try {
    await pool.query("INSERT INTO visits DEFAULT VALUES");
    const result = await pool.query("SELECT COUNT(*) as count FROM visits");
    res.json({
      message: "Hello from Railway!",
      totalVisits: result.rows[0].count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

initDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
