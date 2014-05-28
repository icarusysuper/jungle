var path = require('path');

module.exports = {
	port: 18080,
	session_secret: 'jungle',

	db_port: '8908',
	db_name: 'oZzAxOjiyrXtGWephKtE',
	db_host: 'mongo.duapp.com',
	username: 'Bf6ZxhPPEi1owjARKNz8dVDH',
	password: 'AMGvoTYywH0ycuPfmGCs2TA6b2MGaU3S',

	upload_dir: path.join(__dirname, 'public', 'upload'),
	upload_img_dir: path.join(__dirname, 'public', 'upload', 'images')
};