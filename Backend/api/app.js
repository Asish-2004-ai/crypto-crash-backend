const express = require('express');
const cors = require('cors');
const gameRoutes = require('../routes/gameRoutes');
const serverless = require('serverless-http');

const walletRoutes = require('../routes/walletRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/game', gameRoutes);
app.use('/api/wallet', walletRoutes);
app.get('/', (req, res) => {
  res.send('Crash game backend API is running.');
});

module.exports = app;
module.exports.handler = serverless(app);
