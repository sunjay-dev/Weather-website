const {getUser} = require('../services/auth.service.js');

async function restrictToUserlogin(req,res,next) {
    const token = req.cookies?.token;

    if(!token) return res.redirect('/user/login');

    const user = getUser(token);
    if(!user) return res.redirect('/user/login');

    req.user=user;
    next();
}

async function restrictToLoginedUser(req, res, next) {
    const token = req.cookies?.token;
    if (!token) 
    return next();
    const user = getUser(token);
    if (!user)
    return next();
    return res.redirect('/');
}

module.exports = {restrictToUserlogin, restrictToLoginedUser};