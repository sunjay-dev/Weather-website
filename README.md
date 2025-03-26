# Weather Web App
A simple weather web application that allows users to search for the weather of any city or detect their current location to fetch real-time weather data with a modern UI. The app provides temperature, humidity, rain chances, and other weather conditions using an external API.

<img src="https://github.com/user-attachments/assets/17ddcabf-2f7a-4c52-9b04-c7c97126c117" width="300" height="auto">

## Features
- 🌍 **Search by City** – Enter a city name to get live weather updates.
- 📍 **Detect Location** – Automatically fetch weather data for your current location.
- 🎨 **Responsive UI** – Built with modern design and mobile-friendly experience.
- 📊 **Weather Details** – Includes temperature, rain probability, humidity, and more.

## Technologies Used
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![EJS](https://img.shields.io/badge/ejs-%23B4CA65.svg?style=for-the-badge&logo=ejs&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

- **Frontend:** EJS
- **Backend:** Express + Node.js
- **Database:** Redis (for caching real-time data)
- **API:** Rapid API

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sunjay-dev/Weather-website
   cd Weather-website
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your **.env** file with your API key:
   ```env
   REDIS_HOST= REDIS_HOST
   REDIS_PASSWORD=REDIS_PASSWORD
   REDIS_PORT=REDIS_PORT
   RAPID_API_KEY=RAPID_API_KEY
   PORT=3000
   ```
4. Start the application:
   ```bash
   npm start
   ```

## Usage
- Type a city name and click **Search** to get weather details.
- Click the **Refresh** button to update the weather data.
- Use the **Location button** to fetch your current location's weather.

## License
This project is open-source and available under the **MIT License**.

---
Feel free to contribute or raise an issue if you find any bugs! 🚀
