const mongoose = require('mongoose');

const gameRoundSchema = new mongoose.Schema({
  roundNumber: Number,
  crashPoint: Number,
  seed: String,
  hash: String,
  bets: [{
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    cryptoAmount: Number,
    usdAmount: Number,
    currency: String,
    cashedOut: { type: Boolean, default: false },
    cashoutMultiplier: Number
  }],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GameRound', gameRoundSchema);
