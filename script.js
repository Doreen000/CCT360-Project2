const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=43.5890&longitude=-79.6441&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&forecast_days=1&timezone=auto";
const weatherTypes = [
    { test: (code) => code === 0, name: "Clear sky", symbol: "☀", image: "sunny.jpg" },
    { test: (code) => code <= 3, name: "Partly cloudy", symbol: "☁", image: "cloudy.jpg" },
    { test: (code) => code === 45 || code === 48, name: "Foggy", symbol: "≋", image: "foggy.jpg" },
    { test: (code) => [51, 53, 55, 56, 57].includes(code), name: "Drizzle", symbol: "☂", image: "drizzle.jpg" },
    { test: (code) => [61, 63, 65, 66, 67, 80, 81, 82].includes(code), name: "Rainy", symbol: "☂", image: "Rainy.jpg" },
    { test: (code) => [71, 73, 75, 77, 85, 86].includes(code), name: "Snowy", symbol: "❄", image: "snowy.jpg" },
    { test: (code) => [95, 96, 99].includes(code), name: "Thunderstorms", symbol: "ϟ", image: "thunderstorm.jpg" }
];
const assistants = {
    maya: { name: "MAYA", image: "female%20assistant.png", alt: "Maya, your outfit assistant", voice: "Bring a little colour and a considered layer. ", warm: "I'd go light and easy today: ", cold: "Let's make warmth part of the look: ", wet: "Let's keep you dry without losing the look: " },
    leo: { name: "LEO", image: "male%20assistant.png", alt: "Leo, your outfit assistant", voice: "Keep it comfortable, clean, and ready to go. ", warm: "My pick for today: ", cold: "I'd build the outfit around a warm layer: ", wet: "A practical layer makes all the difference: " }
};
const garments = {
    tee: { label: "Cotton tee", description: "A breathable short-sleeve layer for warm, comfortable weather.", color: "#d6784f", maya: '<path d="M502 405 Q540 435 575 405 L621 414 Q672 427 696 478 L716 531 L663 560 L645 736 Q540 751 430 736 L418 559 L365 530 L390 480 Q435 420 502 405Z"/><path d="M493 423 Q540 452 585 423" fill="none" stroke="#f5d6a5" stroke-width="12"/>', leo: '<path d="M510 448 Q540 480 574 448 L622 452 Q673 462 711 536 L684 600 L650 578 L646 780 Q540 796 434 780 L430 578 L397 600 L362 575 L385 520 Q425 458 510 448Z"/><path d="M505 465 Q540 495 580 465" fill="none" stroke="#f5d6a5" stroke-width="12"/>' },
    sweater: { label: "Knit sweater", description: "A soft, midweight knit keeps the chill off without adding too much bulk.", color: "#496b62", maya: '<path d="M502 405 Q540 435 575 405 L621 414 Q672 427 696 478 L716 531 L663 560 L645 736 Q540 751 430 736 L418 559 L365 530 L390 480 Q435 420 502 405Z"/><path d="M434 510 L647 510 M431 546 L648 546 M430 582 L647 582 M432 618 L646 618 M433 654 L646 654 M435 690 L644 690" fill="none" stroke="#78948a" stroke-width="7"/><path d="M493 423 Q540 452 585 423" fill="none" stroke="#263e38" stroke-width="13"/>', leo: '<path d="M510 448 Q540 480 574 448 L622 452 Q673 462 711 536 L684 600 L650 578 L646 780 Q540 796 434 780 L430 578 L397 600 L362 575 L385 520 Q425 458 510 448Z"/><path d="M438 550 L644 550 M435 590 L644 590 M434 630 L644 630 M434 670 L644 670 M435 710 L644 710 M505 465 Q540 495 580 465" fill="none" stroke="#78948a" stroke-width="7"/>' },
    jacket: { label: "Light jacket", description: "An easy outer layer for cool mornings and changeable afternoon temperatures.", color: "#c37a45", maya: '<path d="M502 405 Q540 435 575 405 L621 414 Q672 427 696 478 L716 531 L663 560 L645 736 Q540 751 430 736 L418 559 L365 530 L390 480 Q435 420 502 405Z"/><path d="M540 438 L540 735 M492 423 Q540 452 585 423 M540 470 L559 470 M540 515 L559 515 M540 560 L559 560" fill="none" stroke="#f0c49d" stroke-width="9"/>', leo: '<path d="M510 448 Q540 480 574 448 L622 452 Q673 462 711 536 L684 600 L650 578 L646 780 Q540 796 434 780 L430 578 L397 600 L362 575 L385 520 Q425 458 510 448Z"/><path d="M540 480 L540 790 M505 465 Q540 495 580 465 M540 515 L559 515 M540 560 L559 560 M540 605 L559 605" fill="none" stroke="#f0c49d" stroke-width="9"/>' },
    puffer: { label: "Down jacket", description: "A warm insulated puffer adds a wind-blocking layer for freezing or snowy days.", color: "#bd5140", maya: '<path d="M502 405 Q540 435 575 405 L621 414 Q672 427 696 478 L716 531 L663 560 L645 736 Q540 751 430 736 L418 559 L365 530 L390 480 Q435 420 502 405Z"/><path d="M426 485 Q540 510 670 485 M418 535 Q540 560 660 535 M422 585 Q540 610 654 585 M426 635 Q540 660 650 635 M433 685 Q540 710 646 685 M540 445 L540 736" fill="none" stroke="#e88a72" stroke-width="10"/>', leo: '<path d="M510 448 Q540 480 574 448 L622 452 Q673 462 711 536 L684 600 L650 578 L646 780 Q540 796 434 780 L430 578 L397 600 L362 575 L385 520 Q425 458 510 448Z"/><path d="M420 510 Q540 540 690 510 M407 560 Q540 590 666 560 M430 610 Q540 640 654 610 M432 660 Q540 690 650 660 M434 710 Q540 740 646 710 M540 480 L540 790" fill="none" stroke="#e88a72" stroke-width="10"/>' },
    raincoat: { label: "Rain jacket", description: "A water-resistant shell is the first layer to reach for when showers are expected.", color: "#347a78", maya: '<path d="M502 405 Q540 435 575 405 L621 414 Q672 427 696 478 L716 531 L663 560 L645 736 Q540 751 430 736 L418 559 L365 530 L390 480 Q435 420 502 405Z"/><path d="M540 438 L540 736 M493 423 Q540 452 585 423 M432 524 L647 524" fill="none" stroke="#9bc9bd" stroke-width="10"/><path d="M524 438 L540 453 L556 438" fill="none" stroke="#f2d89d" stroke-width="9"/>', leo: '<path d="M510 448 Q540 480 574 448 L622 452 Q673 462 711 536 L684 600 L650 578 L646 780 Q540 796 434 780 L430 578 L397 600 L362 575 L385 520 Q425 458 510 448Z"/><path d="M540 480 L540 790 M505 465 Q540 495 580 465 M430 570 L650 570" fill="none" stroke="#9bc9bd" stroke-width="10"/><path d="M524 480 L540 495 L556 480" fill="none" stroke="#f2d89d" stroke-width="9"/>' },
    trousers: { label: "Straight-leg trousers", description: "Full-length trousers add coverage and warmth while keeping the outfit easy to move in.", color: "#344b49", maya: '<path d="M420 730 Q535 750 650 730 L670 918 L568 932 L540 865 L510 932 L411 918Z M414 914 L510 923 L487 1258 Q458 1276 420 1260Z M568 923 L667 914 L660 1260 Q623 1277 603 1256Z"/><path d="M420 934 L497 944 M577 944 L658 934" fill="none" stroke="#6e8b82" stroke-width="9"/>', leo: '<path d="M434 776 Q540 797 646 776 L669 963 L568 977 L540 908 L510 977 L415 963Z M418 958 L510 971 L488 1317 Q452 1334 425 1318Z M568 971 L666 958 L655 1318 Q623 1334 610 1317Z"/><path d="M423 980 L497 990 M579 990 L661 980" fill="none" stroke="#6e8b82" stroke-width="9"/>' },
    shorts: { label: "Easy shorts", description: "Lightweight shorts keep the outfit airy on hot, sunny days.", color: "#e2a04c", maya: '<path d="M430 731 Q540 750 645 731 L660 918 L565 930 L540 864 L510 930 L414 918Z M430 746 L430 792 M645 746 L645 792"/><path d="M540 758 L540 862" fill="none" stroke="#f4d294" stroke-width="9"/>', leo: '<path d="M434 775 Q540 796 646 775 L664 963 L568 975 L540 907 L510 975 L415 963Z M434 790 L434 836 M646 790 L646 836"/><path d="M540 802 L540 905" fill="none" stroke="#f4d294" stroke-width="9"/>' },
    beanie: { label: "Knit beanie", description: "A snug knit hat keeps heat in when the temperature drops.", color: "#d6784f", maya: '<path d="M405 207 Q411 128 481 112 Q555 96 627 137 Q659 157 666 207 Q540 188 405 207Z"/><path d="M405 207 Q535 190 666 207 L661 231 Q536 218 409 235Z" fill="#f0b49c"/>', leo: '<path d="M400 256 Q408 174 480 153 Q552 132 635 176 Q667 195 674 253 Q540 234 400 256Z"/><path d="M400 256 Q536 236 674 253 L668 279 Q535 263 405 284Z" fill="#f0b49c"/>' },
    boots: { label: "Insulated boots", description: "Grippy, insulated boots help keep feet warm and steady on cold, slick streets.", color: "#4a5550", maya: '<path d="M418 1235 Q444 1254 480 1241 L479 1308 Q510 1320 507 1350 Q501 1370 374 1364 Q360 1358 374 1326Z M601 1241 Q635 1254 660 1235 L704 1328 Q719 1359 700 1366 Q588 1373 585 1350 Q580 1321 613 1308Z"/><path d="M378 1340 Q430 1351 503 1340 M590 1340 Q650 1352 704 1340" fill="none" stroke="#d5b889" stroke-width="9"/>', leo: '<path d="M425 1295 Q451 1320 488 1302 L488 1360 Q517 1372 514 1391 Q505 1410 380 1401 Q364 1396 379 1368Z M610 1302 Q645 1320 655 1295 L707 1368 Q722 1397 704 1403 Q587 1410 583 1390 Q580 1371 612 1360Z"/><path d="M382 1383 Q438 1394 510 1383 M588 1383 Q650 1395 710 1383" fill="none" stroke="#d5b889" stroke-width="9"/>' },
    rainboots: { label: "Rain boots", description: "Tall waterproof boots keep socks dry through puddles and wet sidewalks.", color: "#d89b3c", maya: '<path d="M418 1170 Q449 1185 483 1172 L482 1308 Q510 1320 507 1350 Q501 1370 374 1364 Q360 1358 374 1326 L418 1308Z M599 1172 Q634 1185 661 1170 L704 1328 Q719 1359 700 1366 Q588 1373 585 1350 Q580 1321 613 1308Z"/><path d="M415 1210 L483 1210 M598 1210 L664 1210 M378 1340 Q430 1351 503 1340 M590 1340 Q650 1352 704 1340" fill="none" stroke="#f4d294" stroke-width="9"/>', leo: '<path d="M423 1228 Q454 1246 490 1230 L490 1360 Q517 1372 514 1391 Q505 1410 380 1401 Q364 1396 379 1368 L425 1360Z M609 1230 Q645 1246 657 1228 L707 1368 Q722 1397 704 1403 Q587 1410 583 1390 Q580 1371 612 1360Z"/><path d="M423 1270 L490 1270 M609 1270 L668 1270 M382 1383 Q438 1394 510 1383 M588 1383 Q650 1395 710 1383" fill="none" stroke="#f4d294" stroke-width="9"/>' },
    sneakers: { label: "Everyday sneakers", description: "Comfortable shoes finish a casual outfit for walking around town.", color: "#d5e0d5", maya: '<path d="M420 1238 Q446 1253 478 1240 L477 1307 Q509 1319 505 1345 Q500 1363 376 1359 Q361 1355 375 1324Z M602 1240 Q634 1253 660 1238 L703 1325 Q718 1356 701 1360 Q590 1367 586 1345 Q582 1319 613 1307Z"/><path d="M379 1335 L502 1335 M591 1335 L705 1335" fill="none" stroke="#607168" stroke-width="8"/>', leo: '<path d="M426 1298 Q452 1318 487 1303 L487 1358 Q515 1370 512 1390 Q503 1404 382 1399 Q365 1394 380 1368Z M611 1303 Q645 1318 654 1298 L706 1368 Q719 1395 703 1401 Q590 1407 585 1390 Q582 1370 614 1358Z"/><path d="M382 1383 L510 1383 M588 1383 L708 1383" fill="none" stroke="#607168" stroke-width="8"/>' },
    sunglasses: { label: "Sunglasses", description: "A pair of shades is a useful extra when the sun is out for a long stretch.", color: "#303c39", maya: '<path d="M421 202 Q468 181 510 202 L504 231 Q482 251 450 235 Q430 226 421 202Z M570 202 Q612 181 657 202 Q648 226 628 235 Q596 251 576 231Z M510 208 Q540 194 570 208"/>', leo: '<path d="M420 253 Q466 232 510 253 L504 282 Q482 302 449 286 Q430 277 420 253Z M570 253 Q614 232 657 253 Q648 277 629 286 Q596 302 576 282Z M510 259 Q540 245 570 259"/>' }
};
const outfitState = { weather: null, assistant: "maya", unit: "celsius" };

let lastSoundWeatherType = null;

const rainySound = new Audio("rainy.wav");
const drizzleSound = new Audio("drizzle.wav");
const snowySound = new Audio("snowy.wav");
const sunnySound = new Audio("sunnyBirds.wav");
const thunderstormSound = new Audio("thunderstorm.wav");
const cloudySound = new Audio("wind.wav");


function getWeatherType(code) {
    return weatherTypes.find((type) => type.test(code)) || { name: "Mixed conditions", symbol: "◌", image: "default.jpg" };
}

function toFahrenheit(celsius) {
    return Math.round((celsius * 9) / 5 + 32);
}

function formatTemperature(celsius) {
    const value = outfitState.unit === "celsius" ? Math.round(celsius) : toFahrenheit(celsius);
    return String(value);
}

function outfitFor(weather) {
    const temperature = weather.temperature_2m;
    const rainy = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(weather.weather_code) || weather.precipitation > 0;
    const snowy = [71, 73, 75, 77, 85, 86].includes(weather.weather_code);
    let title;
    let opening;
    let items;

    if (rainy) {
        title = "Ready for a rainy day.";
        opening = "wet";
        items = ["raincoat", "trousers", "rainboots"];
        if (temperature < 8 || snowy) items.splice(1, 0, "beanie");
    } else if (snowy || temperature < 0) {
        title = "Bundle up, beautifully.";
        opening = "cold";
        items = ["puffer", "beanie", "trousers", "boots"];
    } else if (temperature < 8) {
        title = "A warm layer for the walk.";
        opening = "cold";
        items = ["sweater", "beanie", "trousers", "boots"];
    } else if (temperature < 15) {
        title = "A little layering goes a long way.";
        opening = "cold";
        items = ["sweater", "trousers", "sneakers"];
    } else if (temperature < 23) {
        title = "An easy layer kind of day.";
        opening = "warm";
        items = ["jacket", "trousers", "sneakers"];
    } else if (temperature >= 23) {
        title = "Keep it light.";
        opening = "warm";
        items = ["tee", "shorts", "sunglasses", "sneakers"];
    } else {
        title = "A comfortable day out.";
        opening = "warm";
        items = ["tee", "trousers", "sneakers"];
    }

    return { title, advice: `${assistants[outfitState.assistant][opening]}${assistants[outfitState.assistant].voice}`, items };
}

function renderOutfitPieces(items) {
    const overlay = document.querySelector("#wardrobe-overlay");
    const list = document.querySelector("#wardrobe-list");
    const assistant = outfitState.assistant;
    overlay.setAttribute("aria-label", `${assistants[assistant].name}'s weather-matched outfit`);
    overlay.innerHTML = items.map((id) => {
        const garment = garments[id];
        return `<g class="garment-layer" style="--garment-color:${garment.color}" data-piece-id="${id}" tabindex="0" role="button" aria-label="${garment.label}. ${garment.description}"><title>${garment.label}</title>${garment[assistant]}</g>`;
    }).join("");
    list.replaceChildren(...items.map((id, index) => {
        const button = document.createElement("button");
        button.className = "wardrobe-item";
        button.type = "button";
        button.dataset.pieceId = id;
        button.innerHTML = `<span class="wardrobe-index">${String(index + 1).padStart(2, "0")}</span>${garments[id].label}`;
        return button;
    }));
    selectOutfitPiece(items[0]);
}

function selectOutfitPiece(id) {
    const garment = garments[id];
    if (!garment) return;
    document.querySelector("#piece-title").textContent = garment.label;
    document.querySelector("#piece-description").textContent = garment.description;
    document.querySelector("#piece-detail .piece-detail-label").textContent = "OUTFIT PIECE";
    document.querySelectorAll("[data-piece-id]").forEach((piece) => {
        const selected = piece.dataset.pieceId === id;
        piece.classList.toggle("is-active", selected);
        if (piece.matches("button")) piece.setAttribute("aria-pressed", String(selected));
    });
}

function renderWeather() {
    const weather = outfitState.weather;
    if (!weather) return;

    const type = getWeatherType(weather.weather_code);
    const assistant = assistants[outfitState.assistant];
    const outfit = outfitFor(weather);
    const temperature = formatTemperature(weather.temperature_2m);
    const apparent = formatTemperature(weather.apparent_temperature);
    const unitLabel = outfitState.unit === "celsius" ? "°C" : "°F";

    document.documentElement.style.setProperty("--scene-image", `url("${type.image}")`);
    document.querySelector("#temperature").textContent = `${temperature}°`;
    document.querySelector("#unit-toggle").textContent = unitLabel;
    document.querySelector("#unit-toggle").setAttribute("aria-label", `Switch to ${outfitState.unit === "celsius" ? "Fahrenheit" : "Celsius"}`);
    document.querySelector("#weather-condition").textContent = type.name;
    document.querySelector("#weather-symbol").textContent = type.symbol;
    document.querySelector("#feels-like").textContent = `${apparent}${unitLabel}`;
    document.querySelector("#wind-speed").textContent = `${Math.round(weather.wind_speed_10m)} km/h`;
    document.querySelector("#humidity").textContent = `${weather.relative_humidity_2m}%`;
    document.querySelector("#precipitation").textContent = `${weather.precipitation} mm`;
    document.querySelector("#weather-time").textContent = weather.is_day ? "Daytime in Mississauga" : "Tonight in Mississauga";
    document.querySelector("#updated-label").textContent = `Updated ${new Intl.DateTimeFormat("en-CA", { hour: "numeric", minute: "2-digit" }).format(new Date())}`;
    document.querySelector("#assistant-name").innerHTML = `${assistant.name} <span>YOUR STYLE ASSISTANT</span>`;
    document.querySelector("#assistant-stage").style.setProperty("--assistant-image", `url("${assistant.image}")`);
    document.querySelector("#assistant-stage").setAttribute("aria-label", assistant.alt);
    document.querySelector("#outfit-title").textContent = outfit.title;
    document.querySelector("#outfit-advice").textContent = outfit.advice;
    renderOutfitPieces(outfit.items);
    document.querySelector(".current-weather").setAttribute("aria-busy", "false");
    document.body.classList.remove("is-loading");
    renderHourly(weather);
}

function playWeatherSound() {
    const weather = outfitState.weather; 
    if (!weather) return;

    const code = weather.weather_code;
    let sound; 

    if ([95,96,99].includes(code)) {
        sound = thunderstormSound; 
    } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
        sound = snowySound;
    } else if ([51, 53, 55, 56, 57].includes(code)) {
        sound = drizzleSound;
    } else if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        sound = rainySound;
    } else if (code === 0) {
        sound = sunnySound;
    } else if (code <= 3) {
        sound = cloudySound;
    }

    if (!sound) return;
    [rainySound, drizzleSound, snowySound, sunnySound, thunderstormSound, cloudySound]
        .forEach((audio) => {
            audio.pause();
            audio.currentTime = 0; 
        });

    sound.play().catch((error) => {
        console.warn("Weather sound could not be played", error);
    });
}

document.querySelector("#play-weather").addEventListener("click", playWeatherSound);


function renderHourly(current) {
    const hourly = outfitState.weatherResponse.hourly;
    const startIndex = Math.max(0, hourly.time.findIndex((time) => time.slice(0, 13) === current.time.slice(0, 13)));
    const items = hourly.time.slice(startIndex, startIndex + 6).map((time, index) => {
        const actualIndex = startIndex + index;
        const hour = new Date(time);
        const label = index === 0 ? "Now" : new Intl.DateTimeFormat("en-CA", { hour: "numeric" }).format(hour);
        const type = getWeatherType(hourly.weather_code[actualIndex]);
        return `<div class="hour-item"><span class="hour-time">${label}</span><span class="hour-symbol" aria-label="${type.name}">${type.symbol}</span><span class="hour-temp">${formatTemperature(hourly.temperature_2m[actualIndex])}°</span></div>`;
    });
    document.querySelector("#hourly-list").innerHTML = items.join("");
}

async function loadWeather() {
    const errorMessage = document.querySelector("#error-message");
    const refreshButton = document.querySelector("#refresh-weather");
    refreshButton.disabled = true;
    errorMessage.hidden = true;

    try {
        const response = await fetch(apiUrl, { cache: "no-store" });
        if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
        const data = await response.json();
        if (!data.current || !data.hourly) throw new Error("Weather response is missing current conditions.");
        outfitState.weather = data.current;
        outfitState.weatherResponse = data;
        renderWeather();
    } catch (error) {
        console.error("Unable to load Mississauga weather:", error);
        errorMessage.hidden = false;
        document.querySelector("#weather-condition").textContent = "Forecast unavailable";
        document.querySelector("#hourly-list").innerHTML = '<p class="hourly-loading">Hourly outlook is unavailable right now.</p>';
        document.querySelector(".current-weather").setAttribute("aria-busy", "false");
        document.body.classList.remove("is-loading");
    } finally {
        refreshButton.disabled = false;
    }
}

document.querySelectorAll(".assistant-choice").forEach((button) => {
    button.addEventListener("click", () => {
        outfitState.assistant = button.dataset.assistant;
        document.querySelectorAll(".assistant-choice").forEach((choice) => {
            const selected = choice === button;
            choice.classList.toggle("is-selected", selected);
            choice.setAttribute("aria-pressed", String(selected));
        });
        renderWeather();
    });
});

document.querySelector("#wardrobe-list").addEventListener("click", (event) => {
    const piece = event.target.closest("[data-piece-id]");
    if (piece) selectOutfitPiece(piece.dataset.pieceId);
});

document.querySelector("#wardrobe-overlay").addEventListener("click", (event) => {
    const piece = event.target.closest("[data-piece-id]");
    if (piece) selectOutfitPiece(piece.dataset.pieceId);
});

document.querySelector("#wardrobe-overlay").addEventListener("keydown", (event) => {
    const piece = event.target.closest("[data-piece-id]");
    if (piece && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        selectOutfitPiece(piece.dataset.pieceId);
    }
});

document.querySelector("#unit-toggle").addEventListener("click", () => {
    outfitState.unit = outfitState.unit === "celsius" ? "fahrenheit" : "celsius";
    renderWeather();
});

document.querySelector("#refresh-weather").addEventListener("click", loadWeather);
document.querySelector("#local-date").textContent = new Intl.DateTimeFormat("en-CA", { weekday: "long", month: "long", day: "numeric" }).format(new Date()).toUpperCase();
loadWeather();
