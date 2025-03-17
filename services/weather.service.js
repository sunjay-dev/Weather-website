const weather = require('weather-js');

async function get_report(city) {

  return new Promise((resolve, reject) => {
    weather.find({ search: city, degreeType: 'C' }, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    });
});
}

module.exports = { get_report };
