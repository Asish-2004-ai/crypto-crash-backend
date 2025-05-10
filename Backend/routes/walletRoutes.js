const express = require('express');
const router = express.Router();
const { checkBalance } = require('../controllers/walletController');

router.get('/balance/:playerId', checkBalance);

module.exports = router;
