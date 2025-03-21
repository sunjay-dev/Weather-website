const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

const weatherRoutes = require('./router/weather.router.js');
app.use('/', weatherRoutes);

app.use(express.static(path.join(__dirname, "public")));

const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port http://localhost:${port}`);
});