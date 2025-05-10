const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');
const walletRoutes = require('./routes/walletRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/game', gameRoutes);
app.use('/api/wallet', walletRoutes);

module.exports = app;
