function refreshList(places) {
  var ul = $("#list");
  ul.empty();

  for (var i = 0; i < places.length; i++) {
    var li = $('<li/>');

    var label = $('<label/>');
    label.text(places[i]);
    label.appendTo(li);

    var button = $('<button/>', {
    	text: 'Erase',
    	id: 'btn_' + i
    });

    button.click(function() {
    	console.log('TODO: Implement!');
    });

    button.appendTo(li);

    li.appendTo(ul);
  }
}

