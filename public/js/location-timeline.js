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
    $('.timelineDetails').empty();

    placeMarker.img = $("<div class='placeMarkerImage'><img src='/images/dot.png'></div>");
    placeMarker.submit = $("<div class='submitBtn'>Submit</div>");
    
    $('.placeMarkerImageWrapper').append(placeMarker.img);
    $('.timelineDetails').append("<h3 class='timelineDetailsName'>" + placeMarker.name + "</h3>");
    $('.timelineDetails').append(placeMarker.description);
    $('.timelineDetails').append(placeMarker.submit);

    placeMarker.img.click(function(){
      $('.timelineDetails').empty();

      $('.timelineDetails').append('<h3>' + placeMarker.name + '</h3>');
      $('.timelineDetails').append(placeMarker.description);
      $('.timelineDetails').append(placeMarker.submit);
    });
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


  $.post('/api/saveToCityTimeline/' + $(this).closest('.timelineDetails').attr('data-id'), cityTimelineData, function(err, results){
    console.log(results);
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

      // EDITABLE TEXTAREA
      // placeMarker.description.on('click', function() {
      //     var originalField = $(this)
      //     var input = $('<textarea class="edit-input" />');
      //     $(this).after(input);
      //     input.height($(this).height());
      //     $(this).hide();
      //     input.val($(this).text());

      //     input.focus();

      //     input.on('blur', function() {
      //       originalField.text(input.val());
      //       input.remove();
      //       originalField.show();
      //     });
      // });

      places.push(placeMarker);

      placeMarker.submit.click(function(){
        submitClick.call(this);
      });
    
  });
};

//slide down library list when click on #myLibrary

$('#myLibrary').on('click', function(){
  $('')
})

$(function(){
  $.get('/api/addToCityTimeline/' + $('.timelineDetails').attr('data-id'), {}, function(responseData){
      console.log('addToCityTimeline responseData:', responseData);
      for(var i = 0; i < responseData.cityTimeline.length; i++){
        renderTimeline(responseData.cityTimeline[i]);
      };
  });

  $.get('/api/getLibrary', {}, function(responseData){
      console.log('addToTimeline responseData:', responseData);
      for(var i = 0; i < responseData.myLibrary.length; i++){
        renderLibrary(responseData.myLibrary[i]);
      };
  });

});


