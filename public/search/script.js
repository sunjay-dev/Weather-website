const alertDiv = document.getElementById('alert');

document.addEventListener("DOMContentLoaded", () => {

    const splash = document.getElementById("splash-screen");
    const mainContent = document.getElementById("chooseLocationDiv");

    let t = parseInt(localStorage.getItem("t")) || 3000;

    setTimeout(() => {
        splash.classList.add("opacity-0", "transition-opacity", "duration-500");
    }, t);

    setTimeout(() => {
        splash.classList.add("hidden");
        mainContent.classList.remove("hidden");
    }, t + 500);

    localStorage.setItem("t", 1000);

    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    let container = document.getElementById('lastSearchedCities');

    if (cities.length === 0) {
        container.innerHTML = "<p class='text-gray-300 text-sm'>No recent searches.</p>";
        return;
    }
    cities = cities.slice(-3);
    container.innerHTML = `
        <div class="space-y-1.5">
            ${cities.reverse().map(city => `
                <button onclick="fetchWeather('${city.name}')"
                    class="w-full bg-white text-gray-700 px-4 py-2 truncate rounded-lg">
                    ${city.name}
                </button>
            `).join('')}
        </div>`;

    let imgList = [
        "night",
        "sunrise",
        "evening",
        "rainny"
    ]
    imgList.forEach(imgName => {
        let img = new Image();
        img.src = `/home/bg/${imgName}.webp`
    })
});

function fetchWeather(name) {
    localStorage.setItem("city", name);
    window.location.href = '/home';
}

function fetchLocation(btn) {
    btn.disabled = true;
    setTimeout(() => btn.disabled = false, 3500);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setTimeout(() => btn.disabled = false, 3500)
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                localStorage.setItem("userLocation", JSON.stringify({ lat, lon }));
                localStorage.removeItem("city");
                window.location.href = '/home';
            },
            (error) => {
                let errorMessage = "An error occurred while fetching location.";
                if (error.code === 1) errorMessage = "Location access denied. Please allow permission.";
                else if (error.code === 2) errorMessage = "Location unavailable.";
                else if (error.code === 3) errorMessage = "Request timed out. Try again.";

                alertDiv.classList.remove("hidden");
                alertDiv.querySelector("p").innerHTML = errorMessage;
                setTimeout(() => alertDiv.classList.add("hidden"), 2000);
            },
            { timeout: 5000, maximumAge: 0 }
        );
    } else {
        alertDiv.classList.remove("hidden");
        alertDiv.querySelector("p").innerHTML = "Geolocation is not supported by this browser.";
        setTimeout(() => alertDiv.classList.add("hidden"), 2000);
    }
}


document.querySelector('form').onsubmit = (e) => {
    e.preventDefault();
    let cityName = document.getElementById('manualLocation').value;

    localStorage.setItem('city', cityName);
    window.location.href = '/home';
}
