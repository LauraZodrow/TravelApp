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

		newBoard.save(function(err, results){
			res.send(results);
		});
	},

	// saveToTimeline: function(req, res){
	// 	var requireTimeline = req.body;
	// 	var timelineArray = req.user.timeline.push(requireTimeline);

	// 	req.user.save();
	// },

	// addToTimeline: function(req, res){
	// 	User.findOne({_id: req.user._id}, function(err, results){
	// 		res.send(results);
	// 	});
	// },

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
			res.send({id: libraryId, location: location});
		});
	},

	getLibrary: function(req, res){
		User.findOne({_id: req.user._id}, function(err, results){
			res.send(results);
		});
	},

	saveToCustomBoard: function(req, res){
		var requestBoardId = req.body;

		var post = req.user.myLibrary.id(requestBoardId.cityId);

		Board.findById(requestBoardId.boardId, function(err, doc){
			post.customBoard.push(doc);
			req.user.save(function(){
				res.send(doc);
			});
		});
	},

	getCustomBoard: function(req, res){
		var post = req.user.myLibrary.id(req.params.id);
		res.send(post);
	},

	updateCityTimeline: function(req, res){
		var updateTimeline = req.body;
	
		var post = req.user.myLibrary.id(req.params.location).cityTimeline.id(updateTimeline.id);
		console.log('updateCityTimeline post: ', post);

		User.findById(req.user.id, function(err, results){
			results.myLibrary.id(req.params.location).cityTimeline.id(post.id).name = updateTimeline.name;
			results.myLibrary.id(req.params.location).cityTimeline.id(post.id).description = updateTimeline.description;
			results.save(function(err, result){
				res.send(result);
			});
		});
	},

	deleteTimelineEntry: function(req, res){
		var deleteEntryId = req.body.id;
		
		// Find the user by id, then remove the timeline object with deleteEntryId
		User.findOne(req.user.id, function(err, user) {
			user.myLibrary.id(req.params.location).cityTimeline.id(deleteEntryId).remove(function(err, results) {

					// Once the remove is done, save the user object
					user.save(function(err, saveresults) {
						res.send({
							err: err, 
							results: results,
							success: err === null
						});
					});
			});
		});

	}

};

module.exports = apiController;