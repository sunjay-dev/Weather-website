const { get_report } = require("../services/weather.service.js");
const redis = require('../config/redis.config.js');

module.exports.fetchWeatherByCity = async (req, res, next) => {

    try {
        const { city } = req.query;

        if (!city) 
        return res.status(400).json({ error: "City parameter is required" });
        
        const cityKey = `weather:${city.toLowerCase().trim()}`;
        const cachedData = await redis.get(cityKey);

        if (cachedData)
            return res.status(200).json(JSON.parse(cachedData));

        const weatherData = await get_report(null, null, city);

        if (!weatherData) {
            return res.status(404).json({ message: "Weather data not found" });
        }

        await redis.set(cityKey, JSON.stringify(weatherData), "EX", 7200);
        return res.json(weatherData);

    } catch (error) {
        res.status(500).json({
            message: "Error Fetching weather data"
        })
    }
}

module.exports.fetchWeatherByLatLon = async (req, res, next) => {

    try {
        let { lat, lon } = req.query;
        console.log(lat, lon);

        const locationKey = `weather:lat${lat}_lon${lon}`;
        const cachedData = await redis.get(locationKey);

        if (cachedData) return res.status(200).json(JSON.parse(cachedData));

        const weatherData = await get_report(lat, lon, null);

        if (!weatherData) {
            return res.status(404).json({ message: "Weather data not found" });
        }

        await redis.set(locationKey, JSON.stringify(weatherData), "EX", 600);
        return res.json(weatherData);
    } catch (error) {
        res.status(500).json({
            message: "Error Fetching weather data"
        })
    }
}