const express = require('express');
const router = express.Router();
const weatherController =  require('../controllers/weather.controller.js');

router.get("/",(req,res)=>{
    res.render("home.ejs")
})

router.get("/api/weather", weatherController.fetchWeather);

module.exports = router;