const zomatoAPI = 'fa1f2b301e470e8aae56848a3f30d51b';
const zomato_search_URL= 'https://developers.zomato.com/api/v2.1/search';

handleSubmit();


function handleSubmit(){
    $('.js-submit').on('click', function(event){
        //$('.js-intro').addClass('hidden');
        console.log(map.center.toJSON().lng);
        //zomatoRequest(map);
        eventBriteRequest();
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
    eventCordinates = [];
    for(let i = 0; i < eventIDs.length; i++){
     $.getJSON(`https://www.eventbriteapi.com/v3/venues/${eventIDs[i]}/?token=${eventBriteToken}`, function (data){
      let cordinates = {
        'latitude':data.latitude,
        'longitude':data.longitude
        }
      eventCordinates.push(cordinates);
      })
     }
     addCordinatesToEventObject();   
  } 

function addCordinatesToEventObject(){
  console.log(eventCordinates);
  for(let i = 0; i < eventBriteArray.events.length; i++){
    eventBriteArray.events[i].latitude = eventCordinates[i].latitude;
    eventBriteArray.events[i].longitude = `${eventCordinates[i].longitude}`;
    };
  }