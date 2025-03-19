const express = require('express');
const path = require('path');
const app = express();
const connectToMongoDB = require('./config/db.config.js');
require('dotenv').config();
const passport = require('passport');
const cookieParser = require('cookie-parser');

connectToMongoDB(process.env.MONGO_DB_URL).then(() => console.log("MongoDB connected"));
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

const weatherRoutes = require('./router/weather.router.js');
const userRoutes = require('./router/user.router.js');
app.use('/', weatherRoutes);
app.use('/user', userRoutes);

app.use(express.static(path.join(__dirname, "public")));

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});