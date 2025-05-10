const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  usdAmount: Number,
  cryptoAmount: Number,
  currency: String,
  transactionType: String, // "bet" or "cashout"
  transactionHash: String,
  priceAtTime: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
