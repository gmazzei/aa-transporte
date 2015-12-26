const INITIAL_ZOOM = 2;
const INITIAL_LOCATION = {lat: 0, lng: 0};


function initMap() {

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: INITIAL_ZOOM,
    center: INITIAL_LOCATION
  });

  var places = [];
  var geocoder = new google.maps.Geocoder();
  var directionsService = new google.maps.DirectionsService;
  var distanceMatrixService = new google.maps.DistanceMatrixService();


  $("#add").click(function() {
      geocodeAddress(geocoder, map, places);
  });

  $("#order").click(function() {
    displayRoutes(map, directionsService, distanceMatrixService, places);
  });
}