var User = require('../models/user.js');

var indexController = {
	index: function(req, res) {
		res.render('index', {
			user: req.user
		})
	},

	account: function(req, res) {
		if (req.params.id){
			User.findById(req.params.id, function(err, doc){
				res.render('account', {
					user: doc
				})
			}) 
		} else {
			res.render('account', {
				user: req.user
			})
		}
	},

	location: function(req, res){
		var location = req.params.location;
		res.render('location', {
			user: req.user,
			location: location,
			myLibrary: req.user.myLibrary.id(location)
		})

	},

	board: function(req, res) {
		res.render('board', {
			user: req.user,
			myLibrary: req.user.myLibrary
		})
	}
};

module.exports = indexController;

