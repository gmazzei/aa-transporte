var geocoderService = {

  GEOCODE_ZOOM: 16,
  geocoder: null,

  initGeocoder: function() {
    geocoderService.geocoder = new google.maps.Geocoder();
  },

  geocodeAddress: function(resultsMap, places) {
    
    var address = UI.getAddress();

    geocoderService.geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        
        var formattedAddress = results[0].formatted_address;
        var location = results[0].geometry.location;

        resultsMap.setCenter(location);
        resultsMap.setZoom(geocoderService.GEOCODE_ZOOM);

        var marker = new google.maps.Marker({
          map: resultsMap,
          position: location
        });

        UI.addPlace(formattedAddress);
        UI.refreshList();

      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
    
  }


};