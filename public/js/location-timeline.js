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

// RenderTimeLine: This function renders the place marker info into the timeline
// @params: placeMarker: an object containing the data for the location, pageLoad: a true or false based on whether the placemarker is being rendered on initial page load (true) or on marker click (false)
var renderTimeline = function(placeMarker, pageLoad) {
    var timelineDetails = $("<div class='timelineDetails'></div>");
    timelineDetails.attr('data-id', placeMarker._id) ;
    
    if (pageLoad) {
      timelineDetails.prepend("<div class='timelineDetailsDescription'>" + placeMarker.description + "</div>");
    }
    else {
      timelineDetails.prepend("<textarea class='editable' placeholder='What is your experience?'>" + placeMarker.description + "</textarea>");
    }

    timelineDetails.prepend("<div class='timelineDetailsDate'>" + placeMarker.date + "</div>");
    timelineDetails.prepend("<h3 class='timelineDetailsName'>" + placeMarker.name + "</h3>");
    $('.timelineWrapper').prepend(timelineDetails);
};

//Show city collection with user id attached to link
var renderLibrary = function(library){
    $('#myLibrary').append('<li><a class="myLibraryList" href="/view/'+ library._id +'">' + library.location + "</a></li>");
};


var submitClick = function() {
  var storeName = $(this).closest('.timelineDetails').find('.timelineDetailsName').text();

  var storeDate = $(this).closest('.timelineDetails').find('.timelineDetailsDate').text();

  var storeDescription = $(this).closest('.timelineDetails').find('.editable').val();

  var cityTimelineData = {
    name: storeName,
    date: storeDate,
    description: storeDescription
  };

  console.log('cityTimelineData: ',cityTimelineData);


  $.post('/api/saveToCityTimeline/' + $(this).closest('.timelineWrapper').attr('data-id'), cityTimelineData, function(err, results){
    console.log(results);
  });

  // make textarea into div
  var originalText = $('.editable').closest('.timelineDetails');
  var newText = originalText.find('textarea').val();
  originalText.find('textarea').replaceWith("<div class='timelineDetailsDescription'>" + newText + "</div>");

  editButton = $("<i class='fa fa-pencil fa-lg edit'></i>");
  $('.timelineDetails').prepend(editButton);

  //remove submit button, after first submit
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

      var entryDate = moment().format("MMMM Do YYYY");
      console.log('entryDate: ', entryDate);

      var placeMarker = {
        name: location.marker.title,
        date: entryDate,
        description: ''
      };

      submitButton = $("<div class='submitButton'>Submit</div>");
      renderTimeline(placeMarker, false);
      $('.timelineDetails:first-of-type').append(submitButton);

      $(document).one('click', '.submitButton', function(){
        submitClick.call(this);
      });
    
  });
};

//show more of timeline
$('.readMore').on('click', function(){
  $('.timelineWrapper').css({overflow: 'visible', height: 'auto'}).slideDown();
  $('.readMore').hide();
  $('.readLess').show();
});

$('.readLess').on('click', function(){
  $('.timelineWrapper').css({overflow: 'hidden', height: '1000px'});
  $('.readLess').hide();
  $('.readMore').show();

});

//onload render timeline and library
$(function(){
  //get cities library in nav bar (cities) 
  $.get('/api/getLibrary', {}, function(responseData){
      for(var i = 0; i < responseData.myLibrary.length; i++){
        renderLibrary(responseData.myLibrary[i]);
      };
  });


  var editButton = $("<i class='fa fa-pencil fa-lg edit'></i>");

  $.get('/api/addToCityTimeline/' + $('.timelineWrapper').attr('data-id'), {}, function(responseData){
      for(var i = 0; i < responseData.cityTimeline.length; i++){
        renderTimeline(responseData.cityTimeline[i], true);
      };
      $('.timelineDetails').append(editButton);
  });

//On click edit the timeline entry
  $(document).on('click', '.edit', function(){

    var editId = $(this).closest('.timelineDetails').attr('data-id');

    var originalText = $(this).closest('.timelineDetails');
    var editText = originalText.find('.timelineDetailsDescription').text();
    originalText.find('.timelineDetailsDescription').replaceWith("<textarea class='editable'>" + editText + "</textarea>")

    var submitEditsButton = $("<div class='submitEditsButton'>Submit Edits</div>");
    var deleteEntryButton = $("<div class='deleteEntryButton'>Delete This Entry</div>");
    var addEditButtons = $(this).closest('.timelineDetails');
    addEditButtons.append(submitEditsButton);
    addEditButtons.append(deleteEntryButton);

    submitEditsButton.on('click', function(){
      // make textarea into div
      var originalText = $(this).closest('.timelineDetails');
      var newText = originalText.find('.editable').val();
      originalText.find('.editable').replaceWith("<div class='timelineDetailsDescription'>" + newText + "</div>");


      var updateName = $(this).closest('.timelineDetails').find('.timelineDetailsName').text();
      var updateDescription = $(this).closest('.timelineDetails').find('.timelineDetailsDescription').text();

      var cityTimelineUpdate = {
        id: editId,
        name: updateName,
        description: updateDescription
      };

      console.log('cityTimelineUpdate: ', cityTimelineUpdate);

      $.post('/api/updateCityTimeline/' + $(this).closest('.timelineWrapper').attr('data-id'), cityTimelineUpdate, function(err, results){
        console.log(results);
      });

      $(this).closest('.timelineDetails').find('.deleteEntryButton').remove();
      $(this).remove();

    });

    deleteEntryButton.on('click', function(){
      var deleteId = $(this).closest('.timelineDetails').attr('data-id');
  
      var deleteEntry = $(this).closest('.timelineDetails');

      $.post('/api/deleteTimelineEntry/' + $(this).closest('.timelineWrapper').attr('data-id'), {id: deleteId}, function(responseData){
        if(responseData.success === true){
          deleteEntry.remove();
        }
      });

      $(this).remove();

    });

  });


  $.get('/api/getCustomBoard/' + currentlocation, {}, function(response){
      for(var i = 0; i < response.customBoard.length; i++){
        var boardRole = $("<h3 class='board-role'>" + response.customBoard[i].role + '</h3>');
        var boardLocation = $('<h5>' + response.customBoard[i].location + '</h5>');
        var boardDetails = $('<p>' + response.customBoard[i].details + '</p>');
        var boardCity = $('<p>' + response.customBoard[i].city + ', ' + response.customBoard[i].country + '</p>');
        $('.customBoard' + response.customBoard[i].role).append(boardRole).append(boardLocation).append(boardDetails).append(boardCity);
      };
  }); //closes get custom board


});


