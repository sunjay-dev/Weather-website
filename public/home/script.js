const forcast = document.getElementById('forcast');
const weather_card = document.getElementById('weather-card');
const dateTimeDiv = document.getElementById('dateTimeDiv');
const time_date_parent = document.getElementById('time-date-parent');
const setting = document.getElementById('setting');

document.addEventListener("DOMContentLoaded",()=>{
    fetch(`/api/weather/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            updateDateTime(data.weather);
            updateForecast(data.weather.forecast);
            updateCurrentWeather(data.weather);
            updateUserInfo(data.user);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
});


function updateDateTime(data){
    document.body.style.backgroundImage = `url('/home/${data.forecast[0].skytextday}.jpg')`;
    const dateAndMonth = new Date(data.current.date).toDateString().split(' ');
    dateTimeDiv.innerHTML = `
    <div class="text-center mb-10">
        <h1 class="text-6xl font-bold" id="time">09:45</h1>
        <p class="mb-4 mt-1 text-gray-300 text-lg">${data.current.day} | ${dateAndMonth[1]} ${dateAndMonth[2]} </p>
    </div> 
    `;
}

function updateForecast(data){
    forcast.innerHTML = "";
    for(let i = 1; i<5; i++){
    forcast.innerHTML +=`
    <div class="text-center">
            <p class="text-sm">${data[i].shortday} ${data[i].date.split("-")[2]}</p>
            <img src="/home/${data[i].skytextday}.png" alt="Weather" class="w-11 h-11 mt-2 mx-auto">
            <p class="text-sm mt-2">${data[i].low}° / ${data[i].high}°</p>
            <p class="text-xs text-gray-300 mt-1">${data[i].precip}% Rain</p>
        </div>`
    }
}

function updateCurrentWeather(data){
    weather_card.innerHTML = `
    <div class="flex items-center justify-between">
            <p class="text-lg">${data.current.observationpoint}</p>
            <img src="/home/threeDots.svg" class="h-5 w-5 rotate-90">
        </div>
        <div class="flex justify-between items-center mt-9 mb-6">
            <div class="space-y-1">
                <h2 class="text-6xl font-bold">${data.current.temperature}°</h2>
                <p class="text-gray-200">${data.current.skytext}</p>
                <p class="text-xs text-gray-200">Chance of Rain: ${data.forecast[0].precip}%</p>
                <p class="text-xs text-gray-200">Humidity: ${data.current.humidity}%</p>
            </div>
            <img src="${`/home/${data.forecast[0].skytextday}.png`}" id="currentWeatherImg" alt="Weather" class="w-28 h-28">
        </div>
    `;
}
function updateUserInfo(data){

    document.getElementById("userImg").src = data.profilePicture;     
    document.getElementById("userName").innerHTML = data.username;  
    document.getElementById("userEmail").innerHTML = data.email;    
    document.getElementById("locationText").innerHTML = data.city;
    document.getElementById("emailToggle").checked = data.emailPrefrence;  
}
function adjustMargin() {
    const timeDateParent = document.getElementById("time-date-parent");
    const weatherCard = document.getElementById("weather-card");
    const footer = document.querySelector("div.fixed.bottom-0");

    if (!timeDateParent || !weatherCard || !footer) return;

    requestAnimationFrame(() => {
        const screenHeight = window.innerHeight;
        const weatherCardBottom = weatherCard.getBoundingClientRect().bottom;
        const footerHeight = footer.offsetHeight;

        const availableSpace = screenHeight - weatherCardBottom - footerHeight;

        timeDateParent.style.marginTop = `${Math.max(availableSpace / 2, 14)}px`;
    });
}
window.addEventListener("load", adjustMargin);
window.addEventListener("resize", adjustMargin);


document.getElementById('setting_footer').addEventListener("click", ()=>{
    time_date_parent.classList.add("hidden");
    setting.classList.remove("hidden");
    
})

document.getElementById('weather_footer').addEventListener("click", ()=>{
    time_date_parent.classList.remove("hidden");
    setting.classList.add("hidden");
    
})

document.getElementById("editLocationBtn").addEventListener("click", function () {
    document.getElementById("locationDisplay").classList.add("hidden");
    document.getElementById("locationEdit").classList.remove("hidden");
});

document.getElementById("saveLocationBtn").addEventListener("click", function () {
    let newLocation = document.getElementById("defaultLocation").value;
    if (newLocation.trim() !== "") {
        document.getElementById("locationText").textContent = newLocation;
    }
    document.getElementById("locationDisplay").classList.remove("hidden");
    document.getElementById("locationEdit").classList.add("hidden");
});
