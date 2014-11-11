$( document ).ready(function() {

	$('.addToBoardBtn').on('click', function(){
		$('#boardForm').show();
	});

	var renderTrack = function(trackData){
		//generate a new list
		var el = $('<div class="individual-board">');

		//set an attribute on li that will let us
		//access the track's specific database ID
		el.attr('data-id', trackData._id);
		el.attr('data-role', trackData.role);

		
		el. append("<div class='button'>Add to Board</div>");

		//append the individual images with each specific role
		el.append('<h3>' + trackData.role + '</h3>');
		if (trackData.role === 'Museums'){
			el.prepend("<i class='fa fa-university fa-2x'></i>")
		} 
		else if (trackData.role ==='Schools'){
			el.prepend("<i class='fa fa-pencil fa-2x'></i>")
		} 
		else if (trackData.role === 'Food'){
			el.prepend("<i class='fa fa-cutlery fa-2x'></i>")
		}
		else if (trackData.role === 'Hostels'){
			el.prepend("<i class='fa fa-home fa-2x'></i>")
		}
		else if (trackData.role === 'Pubs'){
			el.prepend("<i class='fa fa-beer fa-2x'></i>")
		} 

		var content = $('<div class="content"></div>');
		content.append('<h4>' + trackData.location + '</h4>');
		content.append('<p>' + trackData.details + '</p>');
		content.append('<p class="cityCountryInfo">' + trackData.city + ', ' + trackData.country + '</p>');
		el.append(content);
		//give new element back to caller
		return el
	}

	$.get('/api/getBoard', {}, function(responseData){
		console.log('getBoard response', responseData);
		for(var i = 0; i < responseData.length; i++) {
			var trackEl = renderTrack(responseData[i]);

			$('#board-list').prepend(trackEl);
		};
	});

	$('#boardForm').on('submit', function(e){
		e.preventDefault();

		var trackRole = $(this).find('#boardSelect').val();
		var trackLocation = $(this).find('[name=location]').val();
		var trackDetails = $(this).find('[name=details]').val();
		var trackCity = $(this).find('[name=city]').val();
		var trackCountry = $(this).find('[name=country]').val();

		var trackData = {
			role: trackRole,
			location: trackLocation,
			details: trackDetails,
			city: trackCity,
			country: trackCountry
		};

		console.log(trackData);

		$.post('/api/addBoard', trackData, function(responseData){
			var trackEl = renderTrack(responseData);
			$('#board-list').prepend(trackEl);
			trackEl.val();
			console.log('trackEl:', trackEl);
		});
	
		$('#boardForm').hide();

	});


/////////////////////////////SORT NAV//////////////////////////////////
	
	$(document).on('click', '.school-nav', function(){
		$('.individual-board').show();
		$('.individual-board').filter(function(item){
			return $(this).attr('data-role')
				!== "Schools"
			}).hide()

	});

	$(document).on('click', '.food-nav', function(){
		$('.individual-board').show();
		$('.individual-board').filter(function(item){
			return $(this).attr('data-role')
				!== "Food"
			}).hide()

	});

	$(document).on('click', '.hostels-nav', function(){
		$('.individual-board').show();
		$('.individual-board').filter(function(item){
			return $(this).attr('data-role')
				!== "Hostels"
			}).hide()

	});

	$(document).on('click', '.museums-nav', function(){
		$('.individual-board').show();
		$('.individual-board').filter(function(item){
			return $(this).attr('data-role')
				!== "Museums"
			}).hide()

	});

	$(document).on('click', '.pubs-nav', function(){
		$('.individual-board').show();
		$('.individual-board').filter(function(item){
			return $(this).attr('data-role')
				!== "Pubs"
			}).hide()

	});

/////////////////ADD TO CUSTOM BOARD////////////////////

$(document).on('click', '.button', function(){
	$('#myBoardModal').modal('show');
});

// $(document).on('click', '.addButton', function(){
// 	console.log('this', this);
// 	//get board information by id and add it to 'your board'
// 	var storeCityId = $(this).closest('.board-list').find('.individual-board').attr('data-id');
// 	console.log('storeCityId: ', storeCityId);
// 	// $('#myBoardModal')
// });


});



