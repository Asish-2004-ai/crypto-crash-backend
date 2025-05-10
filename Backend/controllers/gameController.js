const Player = require('../models/Player');
const Transaction = require('../models/Transaction');
const GameRound = require('../models/GameRound');
const { getPrice } = require('../services/cryptoService');

exports.placeBet = async (req, res) => {
  try {
    const { playerId, usdAmount, currency } = req.body;

    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ message: 'Player not found' });

    const cryptoSymbol = currency.toLowerCase() === 'btc' ? 'bitcoin' : 'ethereum';
    const price = await getPrice(cryptoSymbol);
    const cryptoAmount = usdAmount / price;

    if (player.wallets[currency.toUpperCase()] < cryptoAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct wallet
    player.wallets[currency.toUpperCase()] -= cryptoAmount;
    await player.save();

    // Save transaction
    const transaction = await Transaction.create({
      playerId,
      usdAmount,
      cryptoAmount,
      currency,
      transactionType: 'bet',
      transactionHash: 'placeholder', // can generate tx hash if needed
      priceAtTime: price
    });

    // Add bet to current round
    let round = await GameRound.findOne().sort({ roundNumber: -1 });
    if (!round || round.bets.length === 0) {
      round = await GameRound.create({
        roundNumber: round ? round.roundNumber + 1 : 1,
        bets: []
      });
    }

    round.bets.push({
      playerId,
      cryptoAmount,
      usdAmount,
      currency 
    });

    await round.save();
    console.log('Round after saving:', round);


    res.json({ message: 'Bet placed', transaction, roundId: round._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cashOut = async (req, res) => {
  try {
    const { playerId, roundId, cashoutMultiplier } = req.body;

    const round = roundId
      ? await GameRound.findById(roundId)
      : await GameRound.findOne().sort({ roundNumber: -1 });

    if (!round) return res.status(404).json({ message: 'Round not found' });

    const bet = round.bets.find(b => b.playerId.toString() === playerId && !b.cashedOut);
    console.log('All bets in round:', round.bets);
    console.log('Looking for playerId:', playerId);

    if (!bet) return res.status(400).json({ message: 'No active bet found' });

    const cryptoWinnings = bet.cryptoAmount * cashoutMultiplier;
    const player = await Player.findById(playerId);

    player.wallets[bet.currency.toUpperCase()] += cryptoWinnings;
    await player.save();

    bet.cashedOut = true;
    bet.cashoutMultiplier = cashoutMultiplier;
    await round.save();

    await Transaction.create({
      playerId,
      usdAmount: bet.usdAmount * cashoutMultiplier,
      cryptoAmount: cryptoWinnings,
      currency: bet.currency,
      transactionType: 'cashout',
      transactionHash: 'placeholder',
      priceAtTime: await getPrice(bet.currency.toLowerCase() === 'btc' ? 'bitcoin' : 'ethereum')
    });

    res.json({ message: 'Cashed out', winnings: cryptoWinnings });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
