var mongoose = require('mongoose');

var myLibrarySchema = mongoose.Schema ({
	places: [{
		location: String,
		timeline: [{
			title: String,
			date: String,
			description: String
		}],
		images: [String],
		board: [{
			role: String,
			location: String,
			details: String,
			city: String,
			country: String
		}]
	}]
});

module.exports = mongoose.model('myLibrary', myLibrarySchema);