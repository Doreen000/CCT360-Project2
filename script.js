const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=43.5789&longitude=-79.6583&hourly=temperature_2m,weather_code&timezone=auto";

function getWeatherDescription(code) {
    switch(code) {
        case 0: return "Sunny";
        case 1:
        case 2:
        case 3: return "Cloudy";
        case 45:
        case 48: return "Foggy";
        case 51:
        case 53:
        case 55: return "Drizzle";
        case 61:
        case 63:
        case 65: return "Rainy";
        case 71:
        case 73:
        case 75: return "Snowy";
        case 95:
        case 96:
        case 99: return "Thunderstorm";
        default: return "Weather Condition: " + code;
    }
}

function getBackgroundImage(code) {
    if (code === 0) {
        // Sunny
        return "url('/CCT360-Project2/sunny.jpg')";
    } else if (code >= 1 && code <= 3) {
        // Cloudy
        return "url('/CCT360-Project2/cloudy.jpg')";
    } else if (code >= 45 && code <= 48) {
        // Foggy
        return "url('/CCT360-Project2/foggy.jpg')";
    } else if (code >= 51 && code <= 55) {
        // Drizzle
        return "url('/CCT360-Project2/drizzle.jpg')";
    } else if (code >= 61 && code <= 65) {
        // Rainy
        return "url('/CCT360-Project2/Rainy.jpg')";
    } else if (code >= 71 && code <= 75) {
        // Snowy
        return "url('/CCT360-Project2/snowy.jpg')";
    } else if (code >= 95 && code <= 99) {
        // Thunderstorm
        return "url('/CCT360-Project2/thunderstorm.jpg')";
    } else {
        // Default
        return "url('/CCT360-Project2/default.jpg')";
    }
}

fetch(apiUrl)
    .then((Response) => Response.json())
    .then((data) => {
        console.log("API success:", data);
        
        let temp = data.hourly.temperature_2m[0];
        let code = data.hourly.weather_code[0];

        console.log("current weather：", code);
        
        //text of temperature & weatheer
        document.querySelector("#temperature").textContent = temp + "°C";
        document.querySelector("#weather-condition").textContent = getWeatherDescription(code);

        //backgroung image
        document.body.style.backgroundImage = getBackgroundImage(code);
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        //change text color
        if ((code >= 61 && code <= 65) || (code >= 95 && code <= 99)) {
            document.body.style.color = "white";
        } else {
            document.body.style.color = "black"; 
        }
    })
        .catch((error) => {
        console.error("Can't get weather data:", error);
        document.querySelector("#weather-condition").textContent = "Error";
    });
