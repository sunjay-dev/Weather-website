const express = require('express');
const router = express.Router();
const weatherController =  require('../controllers/weather.controller.js');

router.get("/", (req,res)=>{
    res.render("search.ejs")
})

router.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *\nDisallow: /private/\nAllow: /public/`);
});

router.get("/home", (req,res)=>{
    res.render("home.ejs")
})
router.get("/weather", weatherController.fetchWeatherByCity);
router.get("/weather/latlon", weatherController.fetchWeatherByLatLon);

module.exports = router;