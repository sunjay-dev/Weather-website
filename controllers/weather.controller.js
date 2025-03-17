
const {get_report} = require("../services/weather.service.js");

module.exports.fetchWeather = async (req, res, next) => {

    const city = req.query.city;

    if(!city){
    return res.status(400).json({
        message: "Please also provide the city"
    })
    }
    const ans = await get_report(city);
    
    return res.json(ans);
}