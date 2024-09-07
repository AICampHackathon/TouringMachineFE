// Function to update the location display
function updateLocation(position) {
    const locationInfo = document.getElementById('location-info');
    const latitude = position.coords.latitude.toFixed(6);
    const longitude = position.coords.longitude.toFixed(6);
    locationInfo.innerHTML = `
        <p>Latitude: ${latitude}</p>
        <p>Longitude: ${longitude}</p>
        <p>Last updated: ${new Date().toLocaleTimeString()}</p>
    `;
}

// Function to handle geolocation errors
function handleError(error) {
    const locationInfo = document.getElementById('location-info');
    switch(error.code) {
        case error.PERMISSION_DENIED:
            locationInfo.innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            locationInfo.innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            locationInfo.innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            locationInfo.innerHTML = "An unknown error occurred.";
            break;
    }
}

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(updateLocation, handleError);
    } else {
        document.getElementById('location-info').innerHTML = "Geolocation is not supported by this browser.";
    }
});
