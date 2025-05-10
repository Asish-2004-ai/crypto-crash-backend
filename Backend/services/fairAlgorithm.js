const crypto = require('crypto');

function generateSeed() {
  return crypto.randomBytes(16).toString('hex');
}

function hashSeed(seed, roundNumber) {
  return crypto.createHash('sha256').update(seed + roundNumber).digest('hex');
}

function getCrashPoint(hash) {
  const hex = parseInt(hash.slice(0, 8), 16);
  const r = hex / 0xFFFFFFFF;
  const maxCrash = 120;
  return Math.max(1, Math.floor(1 + (1 / (1 - r))));
}

module.exports = { generateSeed, hashSeed, getCrashPoint };
