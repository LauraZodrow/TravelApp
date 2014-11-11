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
        img: $("<div class='placeMarkerImage'><img src='./images/dot.png'></div>"),
        name: location.marker.title,
        description: $("<div class='timelineDetailsText'><textarea></textarea></div>")
      };

      places.push(placeMarker);

      $('.timelineDetails').empty();

      $('.placeMarkerImageWrapper').append(placeMarker.img);
      $('.timelineDetails').append("<h3 class='timelineDetailsName'>" + placeMarker.name + "</h3>");
      $('.timelineDetails').append(placeMarker.description);

      placeMarker.img.click(function(){
        $('.timelineDetails').empty();

        $('.timelineDetails').append('<h3>' + placeMarker.name + '</h3>');
        $('.timelineDetails').append(placeMarker.description);

      })
  });
};
