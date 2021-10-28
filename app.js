const express = require('express');
const routes = require('./routes');
const config = require('./config');
const sumary = require('./handler');
const bodyParser = require('body-parser')

var app = express();
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/summary', async (req, res) => {
	return res.render('pages/index', {
		data: {
			code: 'BNBUSDT',
			result: null
		}
	});
})
app.post('/summary', async (req, res) => {
	let { code ,api_key, api_secret} = req.body
	let result = await sumary(code, api_key, api_secret)
	return res.render('pages/index', {
		data: {
			code: code,
			api_key, 
			api_secret,
			result: result,
		}
	});
})

app.use('/api', routes)

app.listen(config.PORT, () => {
	console.log('App listening !! Start Server- port: ', config.PORT);
});

