var mapService = {

  map: null,
  INITIAL_ZOOM: 2,
  INITIAL_LOCATION: {lat: 0, lng: 0},

  initMap: function() {

    var mapElement = UI.getMap();

    mapService.map = new google.maps.Map(mapElement, {
      zoom: mapService.INITIAL_ZOOM,
      center: mapService.INITIAL_LOCATION
    });
  }

}