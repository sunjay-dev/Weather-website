const express = require('express');
const router = express.Router();
const weatherController =  require('../controllers/weather.controller.js');

router.get("/home", (req,res)=>{
    res.render("home.ejs")
})
router.get("/", (req,res)=>{
    res.render("location.ejs")
})
router.get("/weather", weatherController.fetchWeatherByCity);
router.get("/weather/latlon", weatherController.fetchWeatherByLatLon);

module.exports = router;