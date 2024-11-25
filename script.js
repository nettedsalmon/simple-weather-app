import * as utils from './utils.js';

onLoad();

function onLoad() {
  document.querySelector('.js-search-button')
    .addEventListener('click', () => {
      getWeather();
    });

  document.body
    .addEventListener('keydown', event => {
      if (event.key === 'Enter' && document.activeElement.className === 'js-search-field') {
        getWeather();
      }
    });

  const city = localStorage.getItem('lastSearch');
  renderPage(city);
}


function getWeather() {
  const seacrhField = document.querySelector('.js-search-field');
  const city = seacrhField.value;

  if (city !== '') {
    renderPage(city);
    seacrhField.value = '';
  } else {
    alert('Введите название города.');
  }
}


async function getWeatherJson(city) {
  try {
    const weather = await fetch(
      utils.getPath('weather', city, '4f31a25318034689705c331b9e702b16')
    );

    if (!weather.ok) {
      throw 'Ошибка запроса!';
    }

    const forecast = await fetch(
      utils.getPath('forecast', city, '4f31a25318034689705c331b9e702b16') + '&cnt=15'
    );

    localStorage.setItem('lastSearch', city);

    return {
      weatherJson: await weather.json(),
      forecastJson: await forecast.json()
    };
    
  } catch (error) {
    alert('Непредвиденная ошибка!');
  }
}


async function renderPage(city) {
  const response = await getWeatherJson(city);
  const { weatherJson, forecastJson } = response;

  const cityName = weatherJson.name;
  const temp = utils.normalizeTemp(weatherJson.main.temp);
  const iconId = weatherJson.weather[0].icon;
  const description = utils.capitalize(weatherJson.weather[0].description);
  const feelsLike = utils.normalizeTemp(weatherJson.main.feels_like);
  const humidity = weatherJson.main.humidity;
  const pressure = utils.convertPressure(weatherJson.main.pressure);
  const windSpeed = Math.round(weatherJson.wind.speed * 10) / 10;
  const windDirection = utils.convertWindDirection(weatherJson.wind.deg);

  const html = `
    <div class="city-name">${cityName}</div>

    <div class="weather-data">
      <div class="left-section">
        <span class="temp">${temp}&#176;</span>
        <img src="https://openweathermap.org/img/wn/${iconId}@2x.png">
      </div>

      <div class="right-section">
        <div class="description">${description}</div>
        <div class="feels-like">Ощущается как ${feelsLike}&#176;</div>
      </div>
    </div>

    <div class="weather-details">
      <div>
        <img src="icons/humidity.png">
        <span>${humidity}%</span>
      </div>

      <div>
        <img src="icons/pressure.png">
        <span>${pressure} мм рт. ст.</span>
      </div>

      <div>
        <img src="icons/wind.png">
        <span>${windSpeed} м/с, ${windDirection}</span>
      </div>
    </div>

    <div style="background-color: rgb(75, 75, 75); margin-top: 10px; height: 1px; width: 100%"></div>
    <div class="forecast">${renderForecast(forecastJson)}</div>
  `;

  // Animation
  const weatherInfo = document.querySelectorAll('.js-weather-info');
  const weatherContainer = document.querySelector('.weather-container');
  const weatherInfoClone = weatherInfo[0].cloneNode(false);

  weatherInfo[0].innerHTML = html;
  weatherContainer.classList.toggle('scroll');

  setTimeout(() => {
    weatherContainer.insertBefore(weatherInfoClone, weatherInfo[0]);
    weatherInfo[1].remove();
    weatherContainer.classList.toggle('scroll');
  }, 605);
}


function renderForecast(forecastJson) {
  let html = '';

  forecastJson.list.forEach(item => {
    const time = utils.normalizeDate(item.dt_txt);
    const iconId = item.weather[0].icon;
    const temp = utils.normalizeTemp(item.main.temp);

    html += `
      <div class="forecast-item">
        <div class="time">${time}</div>
        <img src="https://openweathermap.org/img/wn/${iconId}@2x.png">
        <div class="temp">${temp}&#176;</div>
      </div>
    `
  });

  return html;
}