const Binance = require('node-binance-api');


const summarySell = (orders) => {
	let sellList = orders.filter(e => {
		return e.side === "SELL" && e.status === 'FILLED'
	})
	let qtys = 0
	let amount = 0
	sellList.map(e => {
		qtys += parseFloat(e.origQty)
		amount += (parseFloat(e.origQty) * parseFloat(e.price))
	})
	return {
		qtys,
		averageSell: qtys > 0 ? amount / qtys : 0,
		amount
	}
}
const summaryBuy = (orders) => {
	let buyList = orders.filter(e => {
		return e.side === "BUY" && e.status === 'FILLED'
	})
	let qtys = 0
	let amount = 0
	buyList.map(e => {
		qtys += parseFloat(e.origQty)
		amount += (parseFloat(e.origQty) * parseFloat(e.price))
	})
	return {
		qtys,
		averageBuy: qtys > 0 ? amount / qtys : 0,
		amount
	}
}
const summaryProfit = (sellOrder, buyOrder, currentPrice) => {
	let coinCurrent = (buyOrder.qtys - sellOrder.qtys) * currentPrice
	let profit = (sellOrder.amount + coinCurrent) - buyOrder.amount
	let percentProfit = profit * 100 / buyOrder.amount
	return { profit, percentProfit };
}

const sumary = async (code, apiKey, apiSecret) => {
	if (code == '' || apiKey == '' || apiSecret == '') {
		return null;
	}
	const binance = new Binance().options({
		APIKEY: apiKey,
		APISECRET: apiSecret
	});
	let data = await binance.allOrders(code)
	let sell = summarySell(data)
	let buy = summaryBuy(data)
	let ticker = await binance.prices(code)
	let curentPrice = parseFloat(ticker[code])
	let calSummaryProfit = summaryProfit(sell, buy, curentPrice)
	let totalMoney = buy.qtys - sell.qtys < 0.01 ? 0 : (buy.qtys - sell.qtys) * curentPrice
	let qtys = buy.qtys - sell.qtys < 0.01 && curentPrice < 100 ? 0 : (buy.qtys - sell.qtys)
	return ({
		status: true,
		averageSell: sell.averageSell,
		code: code,
		averageBuy: buy.averageBuy,
		curentPrice,
		totalMoney,
		qtys,
		profit: calSummaryProfit.profit,
		percentProfit: calSummaryProfit.percentProfit,
		orders: data
	})
}
module.exports = sumary