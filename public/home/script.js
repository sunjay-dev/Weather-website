const forcast = document.getElementById('forcast');
const Day_forcast = document.getElementById('Day_forcast');
const weather_card = document.getElementById('weather-card');
const dateTimeDiv = document.getElementById('dateTimeDiv');
const time_date_parent = document.getElementById('time-date-parent');
const alertDiv = document.getElementById('alert');
let chooseLocationDiv = document.getElementById("chooseLocationDiv");
let currentDateTime;
document.addEventListener("DOMContentLoaded", function () {

    let location = localStorage.getItem("userLocation");

    if (!location) {
        time_date_parent.classList.add("hidden");
        chooseLocationDiv.classList.remove("hidden");

    } else {
        fetchWeatherUsingLatLong(location);
    }
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
        })
        .catch(error => console.error("Weather fetch error:", error));
}

function fetchWeatherUsingCityName() {
    fetch(`/weather/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            updateDateTime(data);
            updateForecast(data.forecast);
            updateCurrentWeather(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
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
        <h1 class="text-6xl font-bold" id="time">--:--</h1> <!-- Placeholder -->
        <p class="mb-4 mt-1 text-gray-300 text-lg">${daysMap[dateAndMonth[0]]} | ${dateAndMonth[1]} ${dateAndMonth[2]} </p>
    </div> `;

    syncWithDeviceClock();
}

function updateHourForecast(data) {
    forcast.innerHTML = "";

    const currentHour = new Date().getHours() + 1;

    // Extract next 4 hours from today's forecast
    const hourlyData = data.forecast.forecastday[0].hour.slice(currentHour, currentHour + 4);

    // Loop through the next 4 hours
    hourlyData.forEach(hour => {
        const time = new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });


        forcast.innerHTML += `
        <div class="text-center">
            <p class="text-sm">${time}</p>
            <img src="/home/${getIconPath(hour.condition.code, hour.is_day)}" alt="Weather" class="w-11 h-11 object-cover mt-2">
            <p class="text-sm mt-2">${hour.temp_c}°C</p>
            <p class="text-xs text-gray-300 mt-1">${hour.chance_of_rain}% Rain</p>
        </div>`;
    });
}

function updateCurrentWeather(data) {
    const isDay = data.current.is_day === 1;

    weather_card.innerHTML = `
    <div class="flex items-center justify-between">
            <p class="text-lg">${data.location.name}, ${data.location.region}</p>
            <img src="/home/threeDots.svg" class="h-5 w-5 rotate-90">
        </div>
        <div class="flex justify-between items-center mt-9 mb-6">
            <div class="space-y-1">
                <h2 class="text-6xl font-bold">${data.current.temp_c}°</h2>
                <p class="text-gray-200">${data.current.condition.text}</p>
                <p class="text-xs text-gray-200">Chance of Rain: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%</p>
                <p class="text-xs text-gray-200">Humidity: ${data.current.humidity}%</p>
            </div>
            <img src="/home/${getIconPath(data.current.condition.code, isDay)}" id="currentWeatherImg" alt="Weather" class="w-28 h-28">
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

function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                console.log(lat, lon)
                localStorage.setItem("userLocation", JSON.stringify({ lat, lon }));
                window.location.reload();
            },
            (error) => {
                alertDiv.classList.remove("hidden");
                alertDiv.querySelector("p").innerHTML = "Location access denied. Enter manually.";
            }
        );
    } else {
        alertDiv.classList.remove("hidden");
        alertDiv.querySelector("p").innerHTML = "Geolocation is not supported by this browser.";
    }
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