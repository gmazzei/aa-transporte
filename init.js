var directionsService;
var distanceMatrixService;

function initMap() {

  mapService.initMap();
  UI.init();
  geocoderService.initGeocoder();
  directionsService = new google.maps.DirectionsService;
  distanceMatrixService = new google.maps.DistanceMatrixService();
  
}