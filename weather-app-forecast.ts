// Open weather api key
const apiKey = 'bd5e378503939ddaee76f12ad7a97608';

// Get the Id of get weather button and Input text value in the cityInput var
document.getElementById('getWeatherBtn')?.addEventListener('click', () => {
  const cityInput = (document.getElementById('cityInput') as HTMLInputElement)
    .value;
  getWeather(cityInput);
});

// This getWeather function shows the result of weather in InputCity in the
// WeatherResult Div in Html code
async function getWeather(city: string) {
  const weatherResult = document.getElementById('weatherResult')!;
  weatherResult.innerHTML = 'Loading..';

  // This forecastResult function shows the result of weather of next 5 days
  // forecastResult Div in Html code
  const forecastResult = document.getElementById('forecastResult')!;
  forecastResult.innerHTML = ''; // inital forecastResult box will be blank

  // this fetch data from openweather website and its resposnse is store in response var
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
    );

    if (!response.ok) {
      throw new Error('City not found');
    }

    // If Above reposnse is valid then  we fetch all meta data
    const data = await response.json();

    // This displayweather function shows all the meta data information on UI
    displayWeather(data);

    // This setbackground function changes the images dynamically as per the data we collected above
    setBackground(data.weather[0].main);

    // this forecast var ftech all the data of next 5 days of cityInput value
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`,
    );

    if (!forecastResponse.ok) {
      throw new Error('Forecast not found');
    }

    // If Above reposnse is valid then  we fetch all meta data
    const forecastData = await forecastResponse.json();

    // This displayweather function shows all the meta data information on UI
    displayForecast(forecastData);
  } catch (error) {
    weatherResult.innerHTML = 'Error Fetching weather data';
  }
}

// This displayweather function defines all the meta data information on UI
function displayWeather(data: any) {
  const weatherResult = document.getElementById('weatherResult')!;
  weatherResult.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Weather: ${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

// This displayForecast function defines all the meta data information on UI
function displayForecast(data: any) {
  const forecastResult = document.getElementById('forecastResult')!;
  forecastResult.innerHTML = '<h3>5-Day Forecast:</h3>';

  const forecastList = data.list.filter(
    (_: any, index: number) => index % 8 === 0,
  );

  forecastList.forEach((forecast: any) => {
    const forecastDate = new Date(forecast.dt_txt).toLocaleDateString();
    forecastResult.innerHTML += `
      <div>
        <p>${forecastDate}</p>
        <p>Temperature: ${forecast.main.temp}°C</p>
        <p>Weather: ${forecast.weather[0].description}</p>
      </div>
    `;
  });
}

// This setBackground function defines the change of background images according to weather data
function setBackground(weather: string) {
  const body = document.body;
  body.className = '';

  switch (weather.toLowerCase()) {
    case 'clear':
      body.classList.add('clear');
      break;
    case 'clouds':
      body.classList.add('cloudy');
      break;
    case 'rain':
    case 'drizzle':
    case 'thunderstorm':
      body.classList.add('rainy');
      break;
    case 'snow':
      body.classList.add('snowy');
      break;
    case 'haze':
      body.classList.add('haze');
      break;
    default:
      body.style.background = 'lightblue';
  }
}
