// Function to update the location information
function updateLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    const locationInfo = document.getElementById('location-info');
    locationInfo.innerHTML = `
        <p>Latitude: ${latitude}</p>
        <p>Longitude: ${longitude}</p>
        <p>Accuracy: ${accuracy} meters</p>
    `;
}

// Function to handle errors
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

// Function to handle dietary preference selection
function handleDietaryPreference() {
    const dropdown = document.getElementById('dietary-preference');
    const selectedPreference = document.getElementById('selected-preference');

    dropdown.addEventListener('change', function() {
        const selected = this.value;
        if (selected) {
            selectedPreference.textContent = `You selected: ${selected}`;
            console.log(`Dietary preference selected: ${selected}`);
        } else {
            selectedPreference.textContent = '';
        }
    });
}

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Check if geolocation is supported
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(updateLocation, handleError);
    } else {
        document.getElementById('location-info').innerHTML = "Geolocation is not supported by your browser.";
    }

    // Initialize dietary preference handling
    handleDietaryPreference();
});
