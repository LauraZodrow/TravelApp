var mongoose = require('mongoose');
var Board = require('../board.js');

Board.find({}, function(err, results){
	if(results.length === 0){
		var villaBorghese = new Board({
			role: 'museum',
			location: 'Villa Borghese',
			details: 'This is one of the most beautiful museums in Rome. It has a gorgeous and vast collection of Bernini works. It is a must see!',
			city: 'Rome',
			country: 'Italy'
		});
		
		villaBorghese.save();

		var vatican = new Board({
			role: 'museum',
			location: 'Vatican',
			details: 'The Vatican is badass, go!',
			city: 'Rome',
			country: 'Italy'
		});
		
		vatican.save();
	}
});