var UI = {

  places: [],

  init: function() {
    $("#add").click(function() {
      geocoderService.geocodeAddress(mapService.map, UI.places);
    });

    $("#order").click(function() {
      routeTracerService.displayRoutes(mapService.map, UI.places);
    });
  },


  refreshList: function() {
    var ul = $("#list");
    ul.empty();

    for (var i = 0; i < UI.places.length; i++) {
      var li = $('<li/>');
      li.attr('place', UI.places[i]);

      var label = $('<label/>', {
        id: 'label_' + i,
        text: UI.places[i],
        class: 'list-text'
      });
      label.appendTo(li);

      var button = $('<button/>', {
        text: 'Erase',
        place_idx: i,
        class: 'delete-link'
      });

      button.click(function() {
        var idx = $(this).attr('place_idx');
        UI.deletePlace(UI.places[idx]);
        UI.refreshList();
      });

      button.appendTo(li);

      li.appendTo(ul);
    }
  },

  addPlace: function(aPlace) {
    UI.places.push(aPlace);
  },

  deletePlace: function(aPlace) {
    UI.places = $.grep(UI.places, function(value) {
      return value != aPlace;
    });
  },

  getAddress: function() {
    return $('#address').val()
  },

  getMap: function() {
    return document.getElementById('map');
  }


};