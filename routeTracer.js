var routeTracerService = {
  
  displayRoutes: function(map, places) {
    var orderedList = [];

    var properties = {
      origins: UI.places,
      destinations: UI.places,
      travelMode: google.maps.TravelMode.DRIVING
    };


    var callback = function(response, status) {
      if (status == google.maps.DistanceMatrixStatus.OK) {
        
        var names = routeTracerService.orderPlaces(response);
        
        for (var i = 0; i < names.length - 1; i++) {
          routeTracerService.displayOneRoute(map, names[i], names[i+1]);
        }
      }
    }

    distanceMatrixService.getDistanceMatrix(properties, callback);
    
  },


  displayOneRoute: function(map, origin, destination) {

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
  },



  /**
  Returns an ordered list of places by distance (between each other)
  **/
  orderPlaces: function(response) {
    var orderedList = [];
    var names = [];
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    var mat = routeTracerService.getDistances(response);
        
    var next = 0;
    names.push(origins[next]);
    orderedList.push(next);

    for (var i = 0; i < mat.length-1; i++) {
      var next = routeTracerService.findNext(next, mat, orderedList);
      orderedList.push(next);
      names.push(origins[next]);
    }

    return names;
  },





  /**
  Builds a matrix of distances
  **/

  getDistances: function(response) {
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
  },


  /**
  Finds the index of the closest place
  **/
  findNext: function(pos, mat, orderedList) {
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


};