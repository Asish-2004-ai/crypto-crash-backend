const Player = require('../models/Player');
const { getPrice } = require('../services/cryptoService');

exports.checkBalance = async (req, res) => {
  try {
    const { playerId } = req.params;
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ message: 'Player not found' });

    const btcPrice = await getPrice('bitcoin');
    const ethPrice = await getPrice('ethereum');

    const totalUSD = (player.wallets.BTC * btcPrice) + (player.wallets.ETH * ethPrice);

    res.json({
      BTC: player.wallets.BTC,
      ETH: player.wallets.ETH,
      totalUSD: totalUSD.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
