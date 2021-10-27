if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

module.exports = {
	APIKEY: process.env.APIKEY,
	APISECRET: process.env.APISECRET,
	PORT: process.env.PORT
}
