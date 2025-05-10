const axios = require('axios');

let cachedPrices = {};
let lastFetched = 0;

async function getPrice(cryptoSymbol) {
  const now = Date.now();
  if (now - lastFetched < 10000 && cachedPrices[cryptoSymbol]) {
    return cachedPrices[cryptoSymbol];
  }
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoSymbol}&vs_currencies=usd`);
    const price = response.data[cryptoSymbol].usd;
    cachedPrices[cryptoSymbol] = price;
    lastFetched = now;
    return price;
  } catch (err) {
    if (cachedPrices[cryptoSymbol]) return cachedPrices[cryptoSymbol];
    throw new Error('Failed to fetch price');
  }
}

module.exports = { getPrice };
