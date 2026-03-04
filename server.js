const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Création table
pool.query(`
CREATE TABLE IF NOT EXISTS sensor_data (
  id SERIAL PRIMARY KEY,
  temperature REAL,
  humidity REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`);

app.post('/data', async (req, res) => {
  const { temperature, humidity } = req.body;

  await pool.query(
    'INSERT INTO sensor_data (temperature, humidity) VALUES ($1, $2)',
    [temperature, humidity]
  );

  res.json({ status: "Saved" });
});

app.get('/data', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 50'
  );
  res.json(result.rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));