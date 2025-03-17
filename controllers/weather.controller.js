const { get_report } = require("../services/weather.service.js");
const redis = require('../config/redis.config.js');

module.exports.fetchWeather = async (req, res, next) => {

    const city = req.query.city;

    if (!city) return res.status(400).json({ message: "Please also provide the city" });

    try {
        const cityKey = `weather:${city.toLowerCase().trim()}`;
        const cachedData = await redis.get(cityKey);
        
        if (cachedData)
        return res.status(200).json(JSON.parse(cachedData));

        const weatherData = await get_report(city);

        if (!weatherData) {
            return res.status(404).json({ message: "Weather data not found" });
        }

        await redis.set(cityKey, JSON.stringify(weatherData[0]), "EX", 7200);
        return res.json(weatherData[0]);

    } catch (error) {
        res.status(500).json({
            message: "Error Fetching weather data"
        })
    }
}