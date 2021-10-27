const binance = require('../utils/binanceUtils')

const sumary = async (code) => {
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
	 return ({
		status: true,
		averagePrice: totalMoney / qtys,
		curentPrice,
		totalMoney: parseFloat(qtys) * parseFloat(curentPrice),
		qtys,
		curentMoney,
	})
}
module.exports = sumary