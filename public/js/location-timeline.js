// =================================================
// TravelLine - Timeline
// =================================================

var Timeline = function() {
  this.locations = [];
}

var Location = function(place, map) {
  this.place = place;
  this.map = map;
  // this.date = date;
  // this.description = description;
  console.log(place);
}

Location.prototype.render = function() {
  var image = {
    url: this.place.icon,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)
  };

   this.marker = new google.maps.Marker({
        map: this.map,
        icon: image,
        title: this.place.name,
        position: this.place.geometry.location
      });

   google.maps.event.addListener(this.marker, 'click', this.markerclick.bind(this));
};

var renderTimeline = function(placeMarker) {
    placeMarker.submit = $("<div class='submitBtn'>Submit</div>");
    placeMarker.edit = $("<i class='fa fa-pencil fa-lg edit'></i>");

    var timelineDetails = $("<div class='timelineDetails'></div>");
    timelineDetails.attr('data-id', placeMarker._id) ;
  
    timelineDetails.prepend(placeMarker.submit);
    timelineDetails.prepend(placeMarker.edit);
    timelineDetails.prepend(placeMarker.description);
    timelineDetails.prepend("<h3 class='timelineDetailsName'>" + placeMarker.name + "</h3>");
    $('.timelineWrapper').prepend(timelineDetails);
};

var renderLibrary = function(library){
    $('#myLibrary').append('<li><a class="myLibraryList" href="/view/'+ library._id +'">' + library.location + "</a></li>");
};


var submitClick = function() {
  var storeName = $(this).closest('.timelineDetails').find('.timelineDetailsName').text();

  var storeDescription = $(this).closest('.timelineDetails').find('.editable').val();

  var cityTimelineData = {
    name: storeName,
    description: storeDescription
  };

  console.log('cityTimelineData: ',cityTimelineData);


  $.post('/api/saveToCityTimeline/' + $(this).closest('.timelineWrapper').attr('data-id'), cityTimelineData, function(err, results){
    console.log(results);
  });

  //make textarea into div
  var originalText = $('.editable').closest('.timelineDetails');
  var newText = originalText.find('textarea').val();
  originalText.find('textarea').replaceWith('<div>' + newText + '</div>');

  $(this).remove();

};

//When Marker is clicked Modal appears, asks to add to Timeline.
//If say yes, place name, textarea, and marker will be added to timeline
Location.prototype.markerclick = function(e) {
  //THIS SHOWS MODAL TO 'ADD TO TIMELINE'
  $('#myModal').modal('show');

  var location = this;
  $('.addButton').one('click', function () {
      $('#myModal').modal('hide');

      var places = [];

      //Object stores 'dot' marker information
      var placeMarker = {
        name: location.marker.title,
        description: $("<textarea class='editable' placeholder='What is your experience?'></textarea>"),
        edit: $("<i class='fa fa-pencil fa-lg edit'></i>"),
        submit: $("<div class='submitBtn'>Submit</div>")
      };

      renderTimeline(placeMarker);

      places.push(placeMarker);

      placeMarker.submit.click(function(){
        submitClick.call(this);
      });
    
  });
};

//hover edit button
$('.edit').mouseover(function(){
  console.log('edit works');
  var editDescription = $("<p class='edit-description'>Edit</p>");
  $(this).append(editDescription);
});

$('.edit').on('click', function(){
  console.log('i work');
  var originalText = $('.editable').closest('.timelineDetails');
  var newText = originalText.find('<div>').val();
  originalText.find('<div>').replaceWith('<textarea>' + newText + '</textarea>');

})

//show more of timeline
$('.readMore').on('click', function(){
  $('.timelineWrapper').css({overflow: 'visible'}).slideDown();
  $('.readMore').hide();
  $('.readLess').show();
});

$('.readLess').on('click', function(){
  $('.timelineWrapper').css({overflow: 'hidden'});
  $('.readLess').hide();
  $('.readMore').show();

});

//onload render timeline and library
$(function(){
  $.get('/api/addToCityTimeline/' + $('.timelineWrapper').attr('data-id'), {}, function(responseData){
      for(var i = 0; i < responseData.cityTimeline.length; i++){
        renderTimeline(responseData.cityTimeline[i]);
      };
  });

  $.get('/api/getLibrary', {}, function(responseData){
      for(var i = 0; i < responseData.myLibrary.length; i++){
        renderLibrary(responseData.myLibrary[i]);
      };
  });

  $.get('/api/getCustomBoard/' + currentlocation, {}, function(response){
    console.log('getBoard:', response.customBoard);
    for(var i = 0; i < response.customBoard.length; i++){
      var boardRole = $("<h3 class='board-role'>" + response.customBoard[i].role + '</h3>');
      var boardLocation = $('<h5>' + response.customBoard[i].location + '</h5>');
      var boardDetails = $('<p>' + response.customBoard[i].details + '</p>');
       var boardCity = $('<p>' + response.customBoard[i].city + ', ' + response.customBoard[i].country + '</p>');
       if(response.customBoard[i].role === 'Pubs'){
          $('.customBoardPubs').append(boardRole);
          $('.customBoardPubs').append(boardLocation);
          $('.customBoardPubs').append(boardDetails);
          $('.customBoardPubs').append(boardCity);
       } else if (response.customBoard[i].role === 'Museums') {
          $('.customBoardMuseums').append(boardRole);
          $('.customBoardMuseums').append(boardLocation);
          $('.customBoardMuseums').append(boardDetails);
          $('.customBoardMuseums').append(boardCity);

       } else if (response.customBoard[i].role === 'Schools'){
          $('.customBoardSchools').append(boardRole);
          $('.customBoardSchools').append(boardLocation);
          $('.customBoardSchools').append(boardDetails);
          $('.customBoardSchools').append(boardCity);
       }
    };
});  


});


