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

var addLibrary = function(location){
  //location being sent from marker click function placemarker.name

  $.post('/api/saveToLibrary', {location: location}, function(results){
    console.log(results);
     $('#myLibrary').append('<a class="myLibraryList" href="/view/'+results.id +'"">' + results.location + "</a>");
  });

};

var submitClick = function() {
  var storeName = $(this).closest('.timelineDetails').find('.timelineDetailsName').text();

  var storeDescription = $(this).closest('.timelineDetails').find('.editable').val();

  var timelineData = {
    name: storeName,
    description: storeDescription
  };

  console.log('timelineData: ',timelineData);


  $.post('/api/saveToTimeline', timelineData, function(err, results){
    console.log(results);

  //make textarea into div
  var originalText = $('.editable').closest('.timelineDetails');
  var newText = originalText.find('textarea').val();
  originalText.find('textarea').replaceWith('<div>' + newText + '</div>');
  });
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
        img: $("<div class='placeMarkerImage'><img src='/images/dot.png'></div>"),
        name: location.marker.title,
        description: $("<textarea class='editable' placeholder='What is your experience?'></textarea>"),
        submit: $("<div class='submitBtn'>Submit</div>")
      };


      renderTimeline(placeMarker);

      places.push(placeMarker);

      addLibrary(placeMarker.name);

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


$(function(){
  $.get('/api/addToTimeline', {}, function(responseData){
      console.log('addToTimeline responseData:', responseData);
      for(var i = 0; i < responseData.timeline.length; i++){
        renderTimeline(responseData.timeline[i]);
      };
  });

  $.get('/api/getLibrary', {}, function(responseData){
      console.log('addToTimeline responseData:', responseData);
      for(var i = 0; i < responseData.myLibrary.length; i++){
        renderLibrary(responseData.myLibrary[i]);
      };
  });

});


