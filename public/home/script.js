const forcast = document.getElementById('forcast');
const Day_forcast = document.getElementById('Day_forcast');
const weather_card = document.getElementById('weather-card');
const dateTimeDiv = document.getElementById('dateTimeDiv');
const backDiv = document.getElementById('backDiv');
const err = document.getElementById('err');

document.addEventListener("DOMContentLoaded", function () {
    let location = localStorage.getItem("userLocation");
    let city = localStorage.getItem("city");

    if (!city && !location)
        window.location.href = '/';
    else if (city)
        fetchWeatherUsingCityName(city)
    else
        fetchWeatherUsingLatLong(location);

    backDiv.addEventListener('click', () => window.location.href = '/');
    backDiv.innerHTML = `
    <button class="w-9 h-9 mt-1 flex items-center justify-center bg-white text-gray-700 rounded-full shadow-lg hover:bg-gray-200 transition">
    <img src="/home/icons/back.svg" class="w-6 h-6">
    </button>
    <img src="/logo_white.png" class="w-14 h-14">
    `;
});

function fetchWeatherUsingLatLong(location) {
    let { lat, lon } = JSON.parse(location);
    fetch(`/weather/latlon?lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            document.body.style.backgroundImage = `url('/home/bg/${data.current.is_day ? "day" : "night"}.jpg')`;

            updateDateTime(data);
            updateCurrentWeather(data);
            updateHourForecast(data);
            updateDayForecast(data);
            saveCity(`${data.location.name}, ${data.location.region}`, data.location.lat, data.location.lon);
        })
        .catch(error => {
            console.error("Weather fetch error:", error.message);
            err.classList.remove("hidden");
            err.querySelector("span").innerHTML = error.message;
            setTimeout(() => window.location.href = "/", 2500);
        });
}

function fetchWeatherUsingCityName(city) {
    fetch(`/weather/?city=${city}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            document.body.style.backgroundImage = `url('/home/bg/${data.current.is_day ? "day" : "night"}.jpg')`;

            updateDateTime(data);
            updateCurrentWeather(data);
            updateHourForecast(data);
            updateDayForecast(data);
            saveCity(`${data.location.name}, ${data.location.region}`, data.location.lat, data.location.lon);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error.message);
            err.classList.remove("hidden");
            err.querySelector("span").innerHTML = error.message;
            setTimeout(() => window.location.href = "/", 1500);
        });
}

function updateDateTime(data) {
    const timeZone = data.location.tz_id;
    const dateAndMonth = new Date(data.forecast.forecastday[0].date).toDateString().split(' ');

    function updateTime() {
        const now = new Date();
        const localTime = new Intl.DateTimeFormat('en-GB', {
            timeZone,
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23'
        }).format(now);

        document.getElementById('time').textContent = localTime;
    }

    function syncWithDeviceClock() {
        updateTime();

        const now = new Date();
        const seconds = now.getSeconds();

        const msUntilNextMinute = (60 - seconds) * 1000;
        setTimeout(() => {
            updateTime();
            setInterval(updateTime, 60000);
        }, msUntilNextMinute);
    }

    dateTimeDiv.innerHTML = `
    <div class="text-center mb-10">
        <h1 class="text-6xl font-bold" id="time">--:--</h1>
        <p class="mb-4 mt-1 text-gray-300 text-lg">${daysMap[dateAndMonth[0]]} | ${dateAndMonth[1]} ${dateAndMonth[2]} </p>
    </div> `;

    syncWithDeviceClock();
}

function updateHourForecast(data) {
    const timeZone = data.location.tz_id;
    const now = new Date();

    const currentHour = Number(new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        hourCycle: 'h23'
    }).format(now)) + 1;

    let hourlyData = [];

    if ((24 - currentHour) >= 4) {
        hourlyData = data.forecast.forecastday[0].hour.slice(currentHour, currentHour + 4);
    } else {
        const todayHours = data.forecast.forecastday[0].hour.slice(currentHour, 24);
        const tomorrowHours = data.forecast.forecastday[1].hour.slice(0, 4 - todayHours.length);
        hourlyData = [...todayHours, ...tomorrowHours]
    }

    forcast.innerHTML = "";

    hourlyData.forEach(hour => {
        forcast.innerHTML += `
        <div class="text-center">
            <p class="text-sm">${hour.time.split(' ')[1]}</p>
            <img src="/home/${getIconPath(hour.condition.code, hour.is_day)}" alt="Weather" class="w-11 h-11 object-cover mt-2">
            <p class="text-sm mt-2">${hour.temp_c}°C</p>
            <p class="text-xs text-gray-300 mt-1">${hour.chance_of_rain}% Rain</p>
        </div>`;
    });
}

function updateCurrentWeather(data) {
    weather_card.innerHTML = `
    <div class="flex items-center justify-between">
            <p class="text-lg">${data.location.name}, ${data.location.region}</p>
            <img onclick="refreshLocation()" id="refreshIcon" src="/home/icons/refresh.svg" class="h-5 w-5 rotate-90 cursor-pointer">
        </div>
        <div class="flex justify-between items-center mt-9 mb-6">
            <div class="space-y-1">
                <h2 class="text-6xl font-bold">${data.current.temp_c}°</h2>
                <p class="text-gray-200">${data.current.condition.text}</p>
                <p class="text-xs text-gray-200">Chance of Rain: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%</p>
                <p class="text-xs text-gray-200">Humidity: ${data.current.humidity}%</p>
            </div>
            <img src="/home/${getIconPath(data.current.condition.code, data.current.is_day)}" id="currentWeatherImg" alt="Weather" class="w-28 h-28">
        </div>
    `;
}

function updateDayForecast(data) {
    Day_forcast.innerHTML = "";

    const forecastDays = data.forecast.forecastday.slice(1, 3);

    forecastDays.forEach((day) => {
        let dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        const iconPath = getIconPath(day.day.condition.code, true);

        Day_forcast.innerHTML += `
        <div class="flex justify-between items-center p-2">
            <p class="text-lg font-medium">${dayName}</p>

            <div class="flex items-center">
                <img src="/home/${iconPath}" alt="Weather Icon" class="w-10 h-10">
                <p class="ml-2 font-medium">${day.day.condition.text}</p>
            </div>

            <p class=" font-bold text-lg">${day.day.maxtemp_c}° <span class=" font-medium text-sm">${day.day.mintemp_c}°</span></p>
        </div>`;
    });
}

function getIconPath(conditionCode, isDay) {
    const folder = isDay ? "day" : "night";
    return `${folder}/${conditionCode}.png`;
}

function saveCity(name, lat, lon) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];

    const exists = cities.some(city => city.name === name);

    if (!exists) {
        cities.push({ name, lat, lon });
        localStorage.setItem('cities', JSON.stringify(cities));
    }
}

function refreshLocation() {
    let refreshIcon = document.getElementById("refreshIcon");
    refreshIcon.disabled = true;

   refreshIcon.classList.add("rotate-180");
    setTimeout(() => {
        refreshIcon.classList.remove("rotate-180");
        
        setTimeout(() => {
            refreshIcon.classList.add("rotate-180"); 
            window.location.reload();
            setTimeout(() => {
                refreshIcon.classList.remove("rotate-180"); 
            }, 500);
        }, 500);
    }, 500);
}

const daysMap = {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday"
};