const apiKey = '6b7f9047f4f022ea31fe1a76e6188483'; 

function getWeather() {
    const cityInput = document.getElementById('cityInput').value;
    
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0]; 
                const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            
                fetch(url)
                    .then(response => response.json())
                    .then(weatherData => {
                        displayWeather(weatherData);
                    })
                    .catch(error => {
                        console.error('Error fetching weather data:', error);
                    });
            } else {
                console.error('City not found.');
                displayError('City not found');
            }
        })
        .catch(error => {
            console.error('Error fetching city coordinates:', error);
            displayError('Error fetching city coordinates');
        });
}

function displayWeather(weatherData) {
    const weatherInfo = document.getElementById('weatherInfo');
    const currentWeather = weatherData.current;
    const feelsLikeKelvin = currentWeather.feels_like;
    const feelsLikeCelsius = feelsLikeKelvin - 273.15;
    const sunriseTime = new Date(currentWeather.sunrise * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
    const sunsetTime = new Date(currentWeather.sunset * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
    const precipitation = currentWeather.rain ? `${currentWeather.rain["1h"]} mm` : "None";
    const humidity = currentWeather.humidity;
    
    const temperatureCelsius = currentWeather.temp - 273.15;
    
    const htmlContent = `   
        <div class="weather-card">
            <h2>Current Weather</h2>
            <p>Temperature: ${temperatureCelsius.toFixed(2)}°C</p>
            <p>Feels Like: ${feelsLikeCelsius.toFixed(2)}°C</p>
            <p>Description: ${currentWeather.weather[0].description}</p>
            <p>Sunrise: ${sunriseTime}</p>
            <p>Sunset: ${sunsetTime}</p>
            <p>Precipitation: ${precipitation}</p>
            <p>Humidity: ${humidity}%</p>
            <img src="http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png" alt="Weather Icon">
        </div>
    `;
    
    weatherInfo.innerHTML = htmlContent;
}

function displayError(message) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `<p>${message}</p>`;
}
