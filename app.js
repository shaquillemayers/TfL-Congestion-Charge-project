//Address Button not working. API button id added successfully, 
// as I can edit in CSS, but won't work in JS. Odd.
const findAddressButton = document.getElementById('find-address-button');

     
      
if (findAddressButton){
  findAddressButton.onclick = function() {
    let x = document.getElementById("address_form");
    
    x.style.display = "none";
  }
}


const outputField = document.getElementById("output_field");
const selectAddressButton = document.getElementById("select-address-button");

selectAddressButton.onclick = function() {
  if (outputField.value === ''){
    return;
  } else {
    let x = document.getElementById("address_form");
    let y = document.getElementById("postcode-check");
    let z = document.getElementById("address-search-result");
    
    x.style.display = "none";
    y.style.display = "none"
    z.style.display = "block"
  }
}

const tryAgainButton = document.getElementById("try-again-button");

if (tryAgainButton) {
  tryAgainButton.addEventListener('click', () => {
    let x = document.getElementById("address_form");
    let y = document.getElementById("postcode-check")
    let z = document.getElementById("address-search-result");
    
    x.style.display = "block";
    y.style.display = "block";
    z.style.display = "none";
    
  })
}

        
    let map, infoWindow;
  
    function initMap() {

          let options = {
            center: { lat: 51.5074, lng: -0.1278 },
            zoom: 8,
          }

          map = new google.maps.Map(document.getElementById("map"), {
            options
          });

          let content =  '<div id="info-window-content">' + 
          '<p>Your location</p>' +
          '</div>';

          infoWindow = new google.maps.InfoWindow({
            content: content
          });
          const locationButton = document.createElement("button");
          locationButton.textContent = "Click for Current Location";
          locationButton.classList.add("custom-map-control-button");
          map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
          locationButton.addEventListener("click", () => {
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                  const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  };
                  infoWindow.setPosition(pos);
                  
                  infoWindow.open(map);
                  map.setCenter(pos);
                  map.setZoom(17);
                },
                () => {
                  handleLocationError(true, infoWindow, map.getCenter());
                }
              );
            } else {
              // Browser doesn't support Geolocation
              handleLocationError(false, infoWindow, map.getCenter());
            }
          });

    // Search bar enter/click logic
      const geocoder = new google.maps.Geocoder();
      document.getElementById("submit").addEventListener("click", () => {
          geocodeAddress(geocoder, map);  
      });

      document.getElementById("address").addEventListener("keyup", function (e) {
        if(e.keyCode === 13) {
          geocodeAddress(geocoder, map);
        }
      });    
    }
        
    // Search Bar
    function geocodeAddress(geocoder, resultsMap) {
          const address = document.getElementById("address").value;
          geocoder.geocode({ address: address }, (results, status) => {
            if (status === "OK") {
              resultsMap.setCenter(results[0].geometry.location);
              new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
              });
            } else {
              alert("Geocode was not successful for the following reason: " + status);
            }
          });
        }

    // Postcode API code below throws error, only works in html file
    // Probably down to it calling this code before its loaded/defined
    // Have discussed via IdealPostcodes dev chat but yet to find solution, keep trying!
    // Also cannot access button from API using ID assigned. Could previously. but stopped working.
    // No change in code on my end, no change in docs used.    
    


        

        


        
        
      