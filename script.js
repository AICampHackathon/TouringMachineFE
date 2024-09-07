let currentLatitude, currentLongitude;

// Function to update the location information
function updateLocation(position) {
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    const locationInfo = document.getElementById('location-info');
    locationInfo.innerHTML = `
        <p>Latitude: ${currentLatitude}</p>
        <p>Longitude: ${currentLongitude}</p>
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

// Function to handle the "Go" button click
function handleGoButton() {
    const goButton = document.getElementById('go-button');
    const suggestionsResult = document.getElementById('suggestions-result');

    goButton.addEventListener('click', function() {
        if (currentLatitude && currentLongitude) {
            // Make API call
            fetch(`https://touring-machine.fly.dev/get-suggestions?latitude=${currentLatitude}&longitude=${currentLongitude}`)
                .then(response => response.json())
                .then(data => {
                    // Display results in HTML
                    suggestionsResult.innerHTML = `<p>Suggestions: ${JSON.stringify(data)}</p>`;
                    // Log results to console
                    console.log('Suggestions:', data);
                })
                .catch(error => {
                    suggestionsResult.innerHTML = `<p>Error fetching suggestions: ${error.message}</p>`;
                    console.error('Error:', error);
                });
        } else {
            suggestionsResult.innerHTML = '<p>Location data not available. Please wait for GPS to initialize.</p>';
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

    // Initialize Go button handling
    handleGoButton();
});
