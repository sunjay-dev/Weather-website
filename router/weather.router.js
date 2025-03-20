const express = require('express');
const router = express.Router();
const weatherController =  require('../controllers/weather.controller.js');
const { restrictToUserlogin ,restrictToLoginedUser } = require('../middlewares/auth.middleware.js');

router.get("/",restrictToUserlogin, (req,res)=>{
    res.render("home.ejs")
})

router.get("/api/weather",restrictToUserlogin, weatherController.fetchWeather);

module.exports = router;