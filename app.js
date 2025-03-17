const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

const weatherRoutes = require('./router/weather.router.js');
app.use('/', weatherRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});