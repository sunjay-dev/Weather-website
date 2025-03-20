const { get_report } = require("../services/weather.service.js");
const redis = require('../config/redis.config.js');
const userModel = require('../models/user.model.js');

module.exports.fetchWeather = async (req, res, next) => {

    const { id } = req.user;

    try {
        const user = await userModel.findById(id);
        const city = "Tando ghulam ali, sindh";
        console.log(city);
        
        const cityKey = `weather:${city.toLowerCase().trim()}`;
        const cachedData = await redis.get(cityKey);

        if (cachedData)
            return res.status(200).json({
        weather: JSON.parse(cachedData),
        user
     });

        const weatherData = await get_report(city);

        if (!weatherData) {
            return res.status(404).json({ message: "Weather data not found" });
        }

        await redis.set(cityKey, JSON.stringify(weatherData[0]), "EX", 7200);
        return res.json({
            weather: weatherData[0] ,
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Error Fetching weather data"
        })
    }
}