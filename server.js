const express = require('express');
const app = express();
app.use(express.json());

let sensorData = {
  temperature: 0,
  humidity: 0
};

// ESP32 envoie ici
app.post('/data', (req, res) => {
  sensorData = req.body;
  res.send("Data received");
});

// Flutter lit ici
app.get('/data', (req, res) => {
  res.json(sensorData);
});

app.listen(3000, () => console.log("Server running"));
