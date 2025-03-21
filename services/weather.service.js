async function get_report(lat, lon, city) {

    let q = city ? city : `${lat},${lon}`;

    const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${q}&days=3&u=c`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

module.exports = {get_report };
