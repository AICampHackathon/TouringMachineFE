let currentLatitude, currentLongitude;
let map, marker;

// Function to initialize the map
function initMap() {
    map = L.map('map').fitWorld();
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([0, 0]).addTo(map);
}

// Function to update the location information and map
function updateLocation(position) {
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    const locationInfo = document.getElementById('location-info');
    locationInfo.innerHTML = `
        <p><strong>Latitude:</strong> ${currentLatitude}</p>
        <p><strong>Longitude:</strong> ${currentLongitude}</p>
        <p><strong>Accuracy:</strong> ${accuracy} meters</p>
    `;

    // Update map
    const newLatLng = [currentLatitude, currentLongitude];
    map.setView(newLatLng, 15);
    marker.setLatLng(newLatLng);

    // Get city name
    getCityName(currentLatitude, currentLongitude);
}

// Function to get city name from coordinates
function getCityName(lat, lon) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`)
        .then(response => response.json())
        .then(data => {
            const city = data.address.city || data.address.town || data.address.village || 'Unknown location';
            document.getElementById('welcome-message').textContent = `Welcome to ${city}`;
        })
        .catch(error => {
            console.error('Error fetching city name:', error);
            document.getElementById('welcome-message').textContent = 'Welcome!';
        });
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

// Function to handle the "Go" button click
function handleGoButton() {
    const goButton = document.getElementById('go-button');
    const suggestionsResult = document.getElementById('suggestions-result');
    const userInput = document.getElementById('user-input');

    goButton.addEventListener('click', function() {
        if (currentLatitude && currentLongitude) {
            // Show loading state
            suggestionsResult.innerHTML = '<p class="text-center">Loading suggestions...</p>';
            
            // Make API call
            fetch(`https://touring-machine.fly.dev/get-suggestions?latitude=${currentLatitude}&longitude=${currentLongitude}&preferences=${encodeURIComponent(userInput.value)}`)
                .then(response => response.json())
                .then(data => {
                    // Display results in HTML
                    renderSuggestions(data);
                    // Log results to console
                    console.log('Suggestions:', data);
                })
                .catch(error => {
                    suggestionsResult.innerHTML = `<p class="text-red-500">Error fetching suggestions: ${error.message}</p>`;
                    console.error('Error:', error);
                });
        } else {
            suggestionsResult.innerHTML = '<p class="text-yellow-600">Location data not available. Please wait for GPS to initialize.</p>';
        }
    });
}

// Function to render suggestions
function renderSuggestions(data) {
    const suggestionsResult = document.getElementById('suggestions-result');
    
    let html = `
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-4">Suggestions for ${data.location}</h2>
            <p class="mb-4"><strong>Coordinates:</strong> ${data.latitude}, ${data.longitude}</p>
            
            <div class="space-y-6">
                ${renderSection('Restaurants', data.suggestions.restaurants)}
                ${renderSection('Bookstores', data.suggestions.bookstores)}
                ${renderSection('Other Places', data.suggestions.other_places)}
            </div>
        </div>
    `;

    suggestionsResult.innerHTML = html;
}

// Helper function to render each section
function renderSection(title, items) {
    if (!items || items.length === 0) return '';

    let html = `
        <div class="mt-6">
            <h3 class="text-xl font-semibold mb-3">${title}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    `;

    items.forEach(item => {
        html += `
            <div class="bg-gray-50 p-4 rounded-md shadow">
                <h4 class="font-bold">${item.name}</h4>
                <p class="text-sm text-gray-600">${item.address}</p>
                ${item.cuisine ? `<p class="text-sm text-indigo-600">${item.cuisine}</p>` : ''}
                ${item.category ? `<p class="text-sm text-green-600">${item.category}</p>` : ''}
                ${item.description ? `<p class="text-sm text-green-600">${item.description}</p>` : ''}
                ${item.url ? `<p class="text-sm text-blue-600"><a href=${item.url}>${item.url}</a></p>` : ''}
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Leaflet Map
    initMap();

    // Check if geolocation is supported
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(updateLocation, handleError);
    } else {
        document.getElementById('location-info').innerHTML = "Geolocation is not supported by your browser.";
    }

    // Initialize Go button handling
    handleGoButton();
});
