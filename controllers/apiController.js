var Board = require('../models/board.js');
var User = require('../models/user.js');

var apiController = {

	getBoard: function(req, res){
		//Find all boards and show them in window
		Board.find({}, function(err, results) {
			res.send(results);
		});
	}, 

	addBoard: function(req, res){
		var trackData = req.body;

		var newBoard = new Board(trackData);
		console.log('newBoard:', newBoard);

		newBoard.save(function(err, results){
			console.log('music saved:', results);
			res.send(results);
		});
	},

	saveToTimeline: function(req, res){
		var requireTimeline = req.body;
		var timelineArray = req.user.timeline.push(requireTimeline);

		req.user.save();
	},

	addToTimeline: function(req, res){
		User.findOne({_id: req.user._id}, function(err, results){
			res.send(results);
		});
	},

	saveToCityTimeline: function(req, res){
		var requestTimeline = req.body;
	
		var post = req.user.myLibrary.id(req.params.location);
	
		var cityTimelineArray = post.cityTimeline.push(requestTimeline);
		
		req.user.save();
	},

	addToCityTimeline: function(req, res){
		var post = req.user.myLibrary.id(req.params.location);
		res.send(post);
	},

	saveToLibrary: function(req, res){
		var requireLibrary = req.body;
		var libraryArray = req.user.myLibrary.push(requireLibrary);

		req.user.save( function( err, userDoc) {
			var libraryId = userDoc.myLibrary[userDoc.myLibrary.length -1]._id;
			var location = userDoc.myLibrary[userDoc.myLibrary.length-1].location;
			console.log('libraryID', libraryId);
			res.send({id: libraryId, location: location});
		});
	},

	getLibrary: function(req, res){
		User.findOne({_id: req.user._id}, function(err, results){
			res.send(results);
		});
	}

};

module.exports = apiController;