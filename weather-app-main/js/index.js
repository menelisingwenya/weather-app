// API Configuration
const API_KEY = '5446216f0bebfc6bcb72b0cf4508a0e3'; 
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const weatherResult = document.getElementById('weatherResult');
const loadingSpinner = document.getElementById('loadingSpinner');

// Weather icon mapping
const weatherIconMap = {
    'clear': 'assets/clear.png.jpeg',
    'clouds': 'assets/cloudy.png.jpeg',
    'rain': 'assets/rain.png.jpeg',
    'drizzle': 'assets/rain.png.jpeg',
    'thunderstorm': 'assets/rain.png.jpeg',
    'snow': 'assets/cloudy.png.jpeg',
    'mist': 'assets/cloudy.png.jpeg',
    'fog': 'assets/cloudy.png.jpeg'
};

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Main search handler
async function handleSearch() {
    const city = cityInput.value.trim();
    
    // Validate input
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    // Clear previous errors
    clearError();
    
    // Show loading spinner
    showLoading();
    
    try {
        // Fetch weather data
        const weatherData = await fetchWeatherData(city);
        
        // Display results
        displayWeather(weatherData);
        
        // Hide loading spinner
        hideLoading();
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

// Fetch weather data from API
async function fetchWeatherData(city) {
    const url = `${API_BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your API key in the JavaScript file.');
            } else {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Network error. Please check your internet connection.');
        }
        throw error;
    }
}

// Display weather information
function displayWeather(data) {
    const { main, weather, wind, sys } = data;
    const weatherDescription = weather[0].main.toLowerCase();
    const iconPath = getWeatherIcon(weatherDescription);
    
    // Update DOM elements
    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country || ''}`.trim();
    document.getElementById('weatherDescription').textContent = weather[0].description;
    document.getElementById('temperature').textContent = Math.round(main.temp);
    document.getElementById('feelsLike').textContent = Math.round(main.feels_like) + '°C';
    document.getElementById('humidity').textContent = main.humidity + '%';
    document.getElementById('windSpeed').textContent = wind.speed + ' m/s';
    document.getElementById('pressure').textContent = main.pressure + ' hPa';
    
    // Set weather icon
    const weatherIcon = document.getElementById('weatherIcon');
    weatherIcon.src = iconPath;
    weatherIcon.alt = weather[0].description;
    
    // Show results
    showWeatherResult();
    
    // Clear input
    cityInput.value = '';
}

// Get weather icon based on condition
function getWeatherIcon(description) {
    const lowerDesc = description.toLowerCase();
    
    for (const [key, path] of Object.entries(weatherIconMap)) {
        if (lowerDesc.includes(key)) {
            return path;
        }
    }
    
    // Default icon
    return 'assets/clear.png.jpeg';
}

// Show/Hide functions
function showWeatherResult() {
    weatherResult.classList.remove('hidden');
}

function hideWeatherResult() {
    weatherResult.classList.add('hidden');
}

function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    hideWeatherResult();
    hideLoading();
}

function clearError() {
    errorMessage.textContent = '';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    hideWeatherResult();
    hideLoading();
    console.log('Weather App initialized. Remember to set your API key!');
});
