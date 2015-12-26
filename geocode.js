const GEOCODE_ZOOM = 16;

function geocodeAddress(geocoder, resultsMap, places) {
  var address = $('#address').val();

  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      
      var formattedAddress = results[0].formatted_address;
      var location = results[0].geometry.location;

      resultsMap.setCenter(location);
      resultsMap.setZoom(GEOCODE_ZOOM);

      var marker = new google.maps.Marker({
        map: resultsMap,
        position: location
      });

      places.push(formattedAddress);
      refreshList(places);

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}