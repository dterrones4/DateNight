const zomatoAPI = 'fa1f2b301e470e8aae56848a3f30d51b';
const zomato_search_URL= 'https://developers.zomato.com/api/v2.1/search';

handleSubmit();

function handleSubmit(){
    $('.js-submit').on('click', function(event){
      event.preventDefault();
      $('html, body').animate({ scrollTop: $("#map").offset().top}, 'slow');
        //zomatoRequest(map);
        //eventBriteRequest();
        fourSquareAPI();
        fourSquareActivities();
        fourSquareNightlife();
    });
}

function initAutocomplete(){
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



function zomatoRequest(map){
    let request = {
        'radius':1000,
        'category':'2',
        'lat':map.center.toJSON().lat,
        'lon':map.center.toJSON().lng,
        'user-key':zomatoAPI
    }
    $.getJSON(zomato_search_URL, request).done(data => console.log(data));
    }


const eventBriteToken = 'F4AWWCWFMVMH3FBLRKAB';
const eventBrite_URL = 'https://www.eventbriteapi.com/v3/events/search/'
const eventBriteVenue_URL = 'https://www.eventbriteapi.com/v3/venues/:id/'


let eventBriteArray = [];
function eventBriteRequest(){
  let request = {
    'location.within':'50mi',  
    'location.latitude':`${map.center.toJSON().lat}`,
    'location.longitude':`${map.center.toJSON().lng}`,
    'start_date.keyword':'today',
    'token':eventBriteToken
    }
    $.getJSON(eventBrite_URL, request,).done(data => createEventIdObject(data));
  }

  let eventIDs = [];
  function createEventIdObject(data){
    eventBriteArray = [];
    eventIDs = [];
    for(let i = 0; i < data.pagination.page_size -1; i++){
      eventIDs.push(`${data.events[i].venue_id}`);
    }
    eventBriteArray = data;
    getEventBriteCordinates();
  }

let eventCordinates = [];
function  getEventBriteCordinates(){
    for(let i = 0; i < eventIDs.length; i++){
     $.getJSON(`https://www.eventbriteapi.com/v3/venues/${eventIDs[i]}/?token=${eventBriteToken}`, function (data){
      let cordinates = {
        "latitude":data.latitude,
        "longitude":data.longitude
        }
      eventCordinates[eventCordinates.length] = cordinates;
    })
  }
     console.log(eventCordinates.length);
     console.log(eventCordinates);
     //addCordinatesToEventObject(eventCordinates);   
} 

function addCordinatesToEventObject(eventCordinates){
  //for(let i = 0; i < eventBriteArray.events.length; i++){
    //eventBriteArray.events[i].latitude = eventCordinates[i].latitude;
    //eventBriteArray.events[i].longitude = `${eventCordinates[i].longitude}`;
    };

const fourSquare_URL = 'https://api.foursquare.com/v2/venues/search'
const fourSquareClientID = 'V35QDRVYWDIJAFFIES2SYDH54F0HXJ0MWIN01NI4ALVM1QA0'
const fourSquareClientSecret = 'EB1YIO1Y3K3JHD20I4TBIQ0MB0WYRDRTELAZSJFVTRGNB1T4' 

function fourSquareAPI(){
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
  $.getJSON(fourSquare_URL, request).done(data => addFoodMarkers(data, image));
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

  let image = 'http://funthingsapp.com/wp-content/uploads/2013/11/funthings-icon-transparent.png'
  $.getJSON(fourSquare_URL, request).done(data => addFoodMarkers(data, image));
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
  $.getJSON(fourSquare_URL, request).done(data => addFoodMarkers(data, image));
}

function addFoodMarkers(data, image){
  console.log(data);
  const venue = data.response.venues;
  let icon = {
    url: image,
    scaledSize: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };

  for(let i = 0; i < venue.length; i++){
    let latLng =  new google.maps.LatLng(venue[i].location.lat,venue[i].location.lng);
    let marker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: icon
    });

    let contentString ='<div id="content">'+
    `<h3><a href="${venue[i].url}" target="_blank">${venue[i].name}</a></h3>`+
    `<ul><li>Phone:${venue[i].contact.formattedPhone}</li>`+
    `<li>Address: ${venue[i].location.address}, ${venue[i].location.city}</li>`
    '</ul>'+
    '</div>';

    $('.places').append(contentString);

    let infowindow = new google.maps.InfoWindow({
      content:contentString
    })

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    })
  }
}