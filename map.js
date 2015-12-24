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
    displayRoutes(map, directionsService, service, places);
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



function displayRoutes(map, directionsService, service, places) {
  var orderedList = [];

  var names = getNames(places);
  var properties = {
    origins: names,
    destinations: names,
    travelMode: google.maps.TravelMode.DRIVING
  };


  var callback = function(response, status) {
    if (status == google.maps.DistanceMatrixStatus.OK) {
      
      var names = orderPlaces(response);
      alert(names);
      for (var i = 0; i < names.length - 1; i++) {
        displayOneRoute(map, directionsService, names[i], names[i+1]);
      }
    }
  }

  service.getDistanceMatrix(properties, callback);
  
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


/**
Returns an ordered list of places by distance (between each other)
**/
function orderPlaces(response) {
  var orderedList = [];
  var names = [];
  var origins = response.originAddresses;
  var destinations = response.destinationAddresses;
  var mat = getDistances(response);
      
  var next = 0;
  names.push(origins[next]);
  orderedList.push(next);

  for (var i = 0; i < mat.length-1; i++) {
    var next = findNext(next, mat, orderedList);
    orderedList.push(next);
    names.push(origins[next]);
  }

  return names;
}


/**
Gets a list with the names of the places
**/
function getNames(places) {
  var names = [];
  for (var i = 0; i < places.length; i++) {
    names.push(places[i].name);
  }
  return names;
}


/**
Builds a matrix of distances
**/

function getDistances(response) {
  var mat = [];

  var origins = response.originAddresses;
  var destinations = response.destinationAddresses;

  for (var i = 0; i < origins.length; i++) {
      var row = [];
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        var element = results[j];
        var distance = element.distance.value;
        row.push(distance);
      }
      mat.push(row);
  }

  return mat;
}


/**
Finds the index of the closest place
**/
function findNext(pos, mat, orderedList) {
  var result;
  var distances = mat[pos];

  var min = 100000000;
  for (var i = 0; i < distances.length; i++) {
    if (distances[i] < min && (i != pos) && (orderedList.indexOf(i) < 0)) {
      min = distances[i];
      result = i;
    }
  }

  return result;
}
