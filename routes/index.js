const express = require('express');
const binance = require('../utils/binanceUtils')
var route = express.Router();

route.get('/health', async function (req, res) {
	res.json({
		status: true,
		message: 'service is running',
	})
});
route.get('/price/:code', async (req, res) => {
	let code = req.params.code;
	let ticker = await binance.prices(code)
	res.json({
		status: true,
		data: ticker
	})
})
route.get('/orders/:code', async (req, res) => {
	let code = req.params.code;
	let data = await binance.allOrders(code)
	let buyList = data.filter(e => {
		return e.side === "BUY"
	})

	res.json({
		status: true,
		buyList
	})
})
route.get('/sumary/:code', async (req, res) => {
	let code = req.params.code;
	let data = await binance.allOrders(code)
	let ticker = await binance.prices(code)

	let curentPrice = parseFloat(ticker[code])
	let buyList = data.filter(e => {
		return e.side === "BUY" && e.status === 'FILLED'
	})
	let sellList = data.filter(e => {
		return e.side === "SELL" && e.status === 'FILLED'
	})
	let qtys = 0
	let totalMoney = 0
	buyList.map(e => {
		qtys += parseFloat(e.origQty)
		totalMoney += (parseFloat(e.origQty) * parseFloat(e.price))
	})
	let curentMoney = qtys * curentPrice
	res.json({
		status: true,
		average_price: totalMoney / qtys,
		curentPrice,
		totalMoney: parseFloat(qtys) * parseFloat(curentPrice),
		qtys,
		curentMoney,
	})
})
module.exports = route;
