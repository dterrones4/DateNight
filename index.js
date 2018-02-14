handleSubmit();

function handleSubmit(){
    $('.js-submit').on('click', function(event){
      event.preventDefault();
      $('html, body').animate({ scrollTop: $("#map").offset().top}, 'slow');
        fourSquareFood();
        fourSquareActivities();
        fourSquareNightlife();
        handleClickOnList();
        $('.places').empty();
    });
}

function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:33.1880740, lng:-117.2904340},
        zoom: 15,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
        },
    });

    let input = document.getElementById('address');
    let searchBox = new google.maps.places.SearchBox(input);

    //Offer search results based on maps current location.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

const fourSquare_URL = 'https://api.foursquare.com/v2/venues/search'
const fourSquareClientID = 'V35QDRVYWDIJAFFIES2SYDH54F0HXJ0MWIN01NI4ALVM1QA0'
const fourSquareClientSecret = 'EB1YIO1Y3K3JHD20I4TBIQ0MB0WYRDRTELAZSJFVTRGNB1T4' 

function fourSquareFood(){
  let request ={
    client_id: fourSquareClientID,
    client_secret: fourSquareClientSecret,
    intent: 'browse',
    ll: `${map.center.toJSON().lat},${map.center.toJSON().lng}`,
    categoryId: '4d4b7105d754a06374d81259', //catgoryID is for 'food'
    v: '20180101',
    radius:10000,
    limit: 10
  }

  let image = 'https://cdn4.iconfinder.com/data/icons/food-3-7/65/136-512.png'
  $.getJSON(fourSquare_URL, request).done(data => addMarkers(data, image));
}

function fourSquareActivities(){
  let request ={
    client_id: fourSquareClientID,
    client_secret: fourSquareClientSecret,
    intent: 'browse',
    ll: `${map.center.toJSON().lat},${map.center.toJSON().lng}`,
    categoryId: '4d4b7104d754a06370d81259', //catgoryID is for 'arts & enertainment'
    v: '20180101',
    radius:10000,
    limit: 10
  }

  let image = 'https://mitchellinstitute.org/wp-content/themes/mitchell/library/images/Mitchell-Icons_Orange_News-Events.svg'
  $.getJSON(fourSquare_URL, request).done(data => addMarkers(data, image));
}

function fourSquareNightlife(){
  let request ={
    client_id: fourSquareClientID,
    client_secret: fourSquareClientSecret,
    intent: 'browse',
    ll: `${map.center.toJSON().lat},${map.center.toJSON().lng}`,
    categoryId: '4d4b7105d754a06376d81259', //catgoryID is for 'nightlife Spot'
    v: '20180101',
    radius:10000,
    limit: 10
  }

  let image = 'https://cdn2.iconfinder.com/data/icons/camping-filled-pt-2/100/46_-_coctail_martini_party_nightlife_glass_wine-512.png'
  $.getJSON(fourSquare_URL, request).done(data => addMarkers(data, image));
}

let markers = [];

function addMarkers(data, image){
  const venue = data.response.venues;
  let icon = {
    url: image,
    scaledSize: new google.maps.Size(40, 40),
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };

  for(let i = 0; i < venue.length; i++){

    let contentString ='<div id="content">'+
    `<h3><a href="${venue[i].url}" target="_blank">${venue[i].name}</a></h3>`+
    `<ul><li>Phone: ${venue[i].contact.formattedPhone}</li>`+
    `<li>Address: ${venue[i].location.address}, ${venue[i].location.city}</li>`
    '</ul>'+
    '</div>';

    let infowindow = new google.maps.InfoWindow({
      content:contentString
    });

    let latLng =  new google.maps.LatLng(venue[i].location.lat,venue[i].location.lng);
    let marker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: icon,
      infowindow: infowindow
    });
    
    markers.push(marker);

    $('.places').append(`<div class="listItem" aria-live="polite" data-lat="${venue[i].location.lat}" data-lng="${venue[i].location.lng}" data-position="${[i]}">`+
    `<h3><a href="${venue[i].url}" target="_blank">${venue[i].name}</a></h3>`+
    `<p>Phone: ${venue[i].contact.formattedPhone}<p>`+
    `<p>Address: ${venue[i].location.address}, ${venue[i].location.city}</p>`+
    '</div>');

    google.maps.event.addListener(marker, 'click', function() {
      hideAllInfoWindows(map);
      this.infowindow.open(map, this);
    })
  }
}

function hideAllInfoWindows(map){
  markers.forEach(function(marker) {
    marker.infowindow.close(map, marker);
  });
}

function handleClickOnList(){ 
	$('.places').on('click', '.listItem', function(){
		var thisLat = $(this).data('lat');
    var thisLng = $(this).data('lng');
    let position = $(this).data('position');
		map.setZoom(17);
    map.panTo(new google.maps.LatLng(thisLat, thisLng));
    markers[position].infowindow.open(map, markers[position]);
	});
}