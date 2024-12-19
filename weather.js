const apikey = "088f569f69923ff88603e34e80970b52";

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lon = position.coords.longitude;
      let lat = position.coords.latitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          weatherReport(data);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    });
  }
});

function searchByCity() {
  const place = document.getElementById('input').value.trim();
  if (!place) {
    alert('Please enter a city name.');
    return;
  }

  const urlsearch = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}`;
  
  fetch(urlsearch)
    .then((res) => res.json())
    .then((data) => {
      weatherReport(data);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });

  document.getElementById('input').value = '';
}

function weatherReport(data) {
  const urlcast = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}`;
  
  fetch(urlcast)
    .then((res) => res.json())
    .then((forecast) => {
      hourForecast(forecast);
      dayForecast(forecast);
      updateWeatherUI(data);
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
    });
}

function hourForecast(forecast) {
  const tempList = document.querySelector('.templist');
  tempList.innerHTML = '';
  
  for (let i = 0; i < 5; i++) {
    const date = new Date(forecast.list[i].dt * 1000);
    const time = date.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }).replace(':00', '');
    const temp = `${Math.floor(forecast.list[i].main.temp_max - 273)} °C / ${Math.floor(forecast.list[i].main.temp_min - 273)} °C`;
    const description = forecast.list[i].weather[0].description;
    
    const hourR = createForecastElement(time, temp, description);
    tempList.appendChild(hourR);
  }
}

function dayForecast(forecast) {
  const weekF = document.querySelector('.weekF');
  weekF.innerHTML = '';
  
  for (let i = 8; i < forecast.list.length; i += 8) {
    const date = new Date(forecast.list[i].dt * 1000);
    const day = date.toDateString('en-IN', { timeZone: 'Asia/Kolkata' });
    const temp = `${Math.floor(forecast.list[i].main.temp_max - 273)} °C / ${Math.floor(forecast.list[i].main.temp_min - 273)} °C`;
    const description = forecast.list[i].weather[0].description;
    
    const dayDiv = createForecastElement(day, temp, description);
    weekF.appendChild(dayDiv);
  }
}

function createForecastElement(time, temp, description) {
  const forecastElement = document.createElement('div');
  forecastElement.classList.add('next');
  
  const div = document.createElement('div');
  const timeElement = document.createElement('p');
  timeElement.classList.add('time');
  timeElement.innerText = time;
  div.appendChild(timeElement);

  const tempElement = document.createElement('p');
  tempElement.innerText = temp;
  div.appendChild(tempElement);

  const descriptionElement = document.createElement('p');
  descriptionElement.classList.add('desc');
  descriptionElement.innerText = description;

  forecastElement.appendChild(div);
  forecastElement.appendChild(descriptionElement);

  return forecastElement;
}

function updateWeatherUI(data) {
  document.getElementById('city').innerText = `${data.name}, ${data.sys.country}`;
  document.getElementById('temperature').innerText = `${Math.floor(data.main.temp - 273)} °C`;
  document.getElementById('clouds').innerText = data.weather[0].description;
  
  const icon1 = data.weather[0].icon;
  const iconurl = `https://api.openweathermap.org/img/w/${icon1}.png`;
  document.getElementById('img').src = iconurl;
}
