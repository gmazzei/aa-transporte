function initMap() {

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: -34.397, lng: 150.644}
  });

  var places = [];
  var geocoder = new google.maps.Geocoder();
  var directionsService = new google.maps.DirectionsService;
  var service = new google.maps.DistanceMatrixService();


  document.getElementById('add').addEventListener('click', function() {
    geocodeAddress(geocoder, map, places);
  });

  document.getElementById('order').addEventListener('click', function() {
    orderPlaces(places, service);
    displayRoutes(map, directionsService, places);
  });
}

function geocodeAddress(geocoder, resultsMap, places) {
  var address = document.getElementById('address').value;

  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      
      var location = results[0].geometry.location;

      resultsMap.setCenter(location, 10);

      var marker = new google.maps.Marker({
        map: resultsMap,
        position: location
      });

      addPlace(places, address, location);
      addElement(address);

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function addPlace(places, address, location) {
  places.push({ name: address, pos: location });
}

function addElement(address) {
  var ul = document.getElementById("list");
  var li = document.createElement('li');
  li.appendChild(document.createTextNode(address));
  ul.appendChild(li);
}



function displayRoutes(map, directionsService, places) {
  
  for (var i = 0; i < places.length - 1; i++) {
    displayOneRoute(map, directionsService, places[i].name, places[i+1].name);
  }
}


function displayOneRoute(map, directionsService, origin, destination) {

  var properties = {
    'origin': origin,
    'destination': destination,
    'travelMode': google.maps.TravelMode.DRIVING
  };

  var traceRoute = function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        var directionsRenderer = new google.maps.DirectionsRenderer;
        directionsRenderer.setMap(map);
        directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
  }

  directionsService.route(properties, traceRoute);
}

function orderPlaces(places, service) {

  var orderedList = [];

  var callback = function(response, status) {
    if (status == google.maps.DistanceMatrixStatus.OK) {
      var origins = response.originAddresses;
      var destinations = response.destinationAddresses;
      var selected = [];

      for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        var minimum = {pos: 0, distance: 100000000};

        for (var j = 0; j < results.length; j++) {
          var element = results[j];
          var distance = element.distance.text;
          var duration = element.duration.text;
          var from = origins[i];
          var to = destinations[j];

          if (distance < minimum.distance && selected.indexOf(j) < 0 && i != j) {
            minimum = { 'pos': j, 'distance': distance };
          }
        }
        selected.push(minimum.pos);
      }
    }

    orderedList.push(origins[0]);
    for (var i = 0; i < selected.length; i++) {
      var pos = selected[i];
      orderedList.push(places[pos]);
    }
    console.log(JSON.stringify(orderedList));
  }

  var names = [];
  for (var i = 0; i < places.length; i++) {
    names.push(places[i].name);
  }

  service.getDistanceMatrix({
    origins: names,
    destinations: names,
    travelMode: google.maps.TravelMode.DRIVING
  }, callback);

}

Array.min = function( array ){
    return Math.min.apply( Math, array );
};