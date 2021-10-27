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

app.get('/sumary', async (req, res) => {
	return res.render('pages/index', {
		data: {
			code: 'BNBUSDT',
			result: null
		}
	});
})
app.post('/sumary', async (req, res) => {
	let { code } = req.body
	let result = await sumary(code)
	return res.render('pages/index', {
		data: {
			code: code,
			result: result
		}
	});
})

app.use('/api', routes)

app.listen(config.PORT, () => {
	console.log('App listening !! Start Server- port: ', config.PORT);
});

