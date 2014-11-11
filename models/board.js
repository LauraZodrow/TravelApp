var mongoose = require('mongoose');

var boardSchema = mongoose.Schema ({
	role: String,
	location: String,
	details: String,
	city: String,
	country: String,
	username: String
});

module.exports = mongoose.model('board', boardSchema);