const { Server } = require('socket.io');
const GameRound = require('./models/GameRound');
const { generateSeed, hashSeed, getCrashPoint } = require('./services/fairAlgorithm');

function setupSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  let roundNumber = 1;

  async function startRound() {
    const seed = generateSeed();
    const hash = hashSeed(seed, roundNumber);
    const crashPoint = getCrashPoint(hash);

    const round = await GameRound.create({
      roundNumber,
      crashPoint,
      seed,
      hash,
      bets: []
    });

    io.emit('round_started', { roundNumber, hash });

    let multiplier = 1.00;
    const interval = setInterval(() => {
      multiplier += 0.01;
      io.emit('multiplier_update', { multiplier: multiplier.toFixed(2) });

      if (multiplier >= crashPoint) {
        clearInterval(interval);
        io.emit('round_ended', { roundNumber, crashPoint });
        roundNumber++;
        setTimeout(startRound, 5000);
      }
    }, 100);
  }

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.emit('welcome', 'Connected to Crypto Crash Server');
  });

  startRound();
}

module.exports = { setupSocket };
