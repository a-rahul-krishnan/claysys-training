const apiKey = "e02bec7854f244c3b4795332230407";

async function search() {
    const city = document.getElementById("name").value.trim();
    const resultDiv = document.querySelector(".result");

    if (!city) {
        resultDiv.innerHTML = `<p>Please enter a city name.</p>`;
        return;
    }

    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        const cityName = data.location.name;
        const temp = data.current.temp_c;       
        const humidity = data.current.humidity;
        const icon = data.current.condition.icon; 

        resultDiv.innerHTML = `
            <p><b>City Name:</b> ${cityName}</p>
            <p><b>Temperature:</b> ${temp}°C</p>
            <p><b>Humidity:</b> ${humidity}%</p>
            <p><b>Weather Icon:</b> <br> <img src="${icon}" alt="icon"></p>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}
