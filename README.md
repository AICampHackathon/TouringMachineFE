# Real-time Location Tracker

## Description
This is a simple web application that tracks and displays a user's location in real-time using the browser's Geolocation API.

## Features
- Real-time location tracking
- Displays latitude and longitude
- Updates location as the user moves
- Handles geolocation errors

## Requirements
- A modern web browser with JavaScript enabled
- Internet connection (for loading libraries if any)

## Installation
1. Clone this repository or download the files:
   - index.html
   - script.js
   - README.md
2. No additional installation steps are required.

## Usage
1. Open the `index.html` file in a web browser.
2. Allow the browser to access your location when prompted.
3. Your current location will be displayed and updated in real-time.

## How it works
1. The application uses the HTML5 Geolocation API to access the user's location.
2. JavaScript is used to continuously watch for changes in the user's position.
3. When the location changes, the display is updated with the new coordinates.
4. Error handling is implemented to manage cases where geolocation is unavailable or denied.

## Troubleshooting
- If the location is not displaying, ensure that you have granted permission for the browser to access your location.
- For mobile devices, make sure location services are enabled in your device settings.
- If you're testing locally, some browsers may require the page to be served over HTTPS for geolocation to work. In this case, you may need to set up a local server.
- Clear your browser cache and reload the page if you experience any issues.

For any additional problems or questions, please open an issue in the project repository.
