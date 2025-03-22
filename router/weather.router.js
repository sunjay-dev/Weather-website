const express = require('express');
const router = express.Router();
const weatherController =  require('../controllers/weather.controller.js');

router.get("/", (req,res)=>{
    res.render("search.ejs")
})

router.get("/home", (req,res)=>{
    res.render("home.ejs")
})
router.get("/weather", weatherController.fetchWeatherByCity);
router.get("/weather/latlon", weatherController.fetchWeatherByLatLon);

module.exports = router;