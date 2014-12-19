var User = require('../models/user.js');
var fs = require('fs');

var KEY = 'AKIAINFMPWZMYXQP7PNA';
var SECRET = '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';
var BUCKET = 'mytravelapp';

var indexController = {
	index: function(req, res) {
		res.render('index', {
			user: req.user
		})
	},

	profile: function(req, res) {
		if (req.params.id){
			User.findById(req.params.id, function(err, doc){
				res.render('profile', {
					user: doc
				})
			}) 
		} else {
			res.render('profile', {
				user: req.user
			})
		}
	},

	location: function(req, res){
		var location = req.params.location;
		res.render('location', {
			user: req.user,
			location: location,
			myLibrary: req.user.myLibrary.id(location),
			// cityTimeline: req.user.myLibrary.id(location).cityTimeline
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

