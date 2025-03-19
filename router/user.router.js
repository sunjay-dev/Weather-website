const express = require('express');
const router = express.Router();
const googlePassport = require("../services/googleAuth.service.js");
const { restrictToUserlogin ,restrictToLoginedUser } = require('../middlewares/auth.middleware.js');

router.get("/login",restrictToLoginedUser,(req,res)=>{
    res.render("login.ejs")
})

router.get("/auth/google", restrictToLoginedUser, googlePassport.authenticate("google", { prompt: "select_account"}));

router.get("/auth/google/callback", restrictToLoginedUser, 
  googlePassport.authenticate("google", { session: false }),
  (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Authentication failed" });
    }
    res.cookie("token", req.user.token);

    return res.redirect('/');
  }
);

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).redirect('/user/login');
})


module.exports = router;