const Binance = require('node-binance-api');
const config = require('../config')
const binance = new Binance().options({
	APIKEY: config.APIKEY,
	APISECRET: config.APISECRET
});

module.exports = binance