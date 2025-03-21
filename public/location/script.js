const alertDiv = document.getElementById('alert');

document.addEventListener("DOMContentLoaded", () => {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    let container = document.getElementById('lastSearchedCities');

    if (cities.length === 0) {
        container.innerHTML = "<p class='text-gray-300 text-sm'>No recent searches.</p>";
        return;
    }

    container.innerHTML = `
        <div class="space-y-3">
            ${cities.map(city => `
                <button onclick="fetchWeather('${city.name}')"
                    class="w-full bg-white text-gray-700 px-4 py-2 rounded-lg">
                    ${city.name}
                </button>
            `).join('')}
        </div>`;
});

function fetchWeather(name) {
    localStorage.setItem("city", name);
    window.location.href = '/home';
}

function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                localStorage.setItem("userLocation", JSON.stringify({ lat, lon }));
                window.location.href = '/home';
            },
            (error) => {
                alertDiv.classList.remove("hidden");
                alertDiv.querySelector("p").innerHTML = "Location access denied. Please allow permission.";
            }
        );
    } else {
        alertDiv.classList.remove("hidden");
        alertDiv.querySelector("p").innerHTML = "Geolocation is not supported by this browser.";
    }
}