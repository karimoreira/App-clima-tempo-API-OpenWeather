// API
const apiKey = '5a3815fa46b1987c8b1cf708887d6ae7';
const apiCountryURL = 'https://flagsapi.com/';
const apiCountryParams = '/flat/64.png';
const apiLoremPicsum = "https://picsum.photos/1600/900?random=1&blur=2&query=";

// Selector Dom HTML
const cityInput = document.querySelector('#city-input');
const searchBtn = document.querySelector('#search');
const cityElement = document.querySelector('#city');
const tempeElement = document.querySelector('#temperature span');
const descElement = document.querySelector('#description');
const weatherIconElement = document.querySelector('#weather-icon');
const countryElement = document.querySelector('#country');
const humidityElement = document.querySelector('#humidity span');
const windElement = document.querySelector('#wind span');
const weatherContainer = document.querySelector('#weather-data');
const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");
const suggestionContainer = document.querySelector("#suggestions");
const suggestionButtons = document.querySelectorAll("#suggestions button");

// Funções backend estático
const toggleLoader = () => {
    loader.classList.toggle("hide");
};

const getWeatherData = async (city) => {
    toggleLoader();

    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

    try {
        const res = await fetch(apiWeatherURL);
        const data = await res.json();
        toggleLoader();

        return data;
    } catch (error) {
        console.error('Erro ao obter os dados do clima:', error);
        toggleLoader();
        showErrorMessage();
    }
}

// Tratamento de erro
const showErrorMessage = () => {
    errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => {
    errorMessageContainer.classList.add("hide");
    weatherContainer.classList.add("hide");
    suggestionContainer.classList.add("hide");
};

const showWeatherData = async (city) => {
    hideInformation();

    const dataShow = await getWeatherData(city);

    if (!dataShow || dataShow.cod === "404") {
        showErrorMessage();
        return;
    }

    cityElement.innerHTML = dataShow.name;
    tempeElement.innerHTML = parseInt(dataShow.main.temp);
    descElement.innerHTML = dataShow.weather[0].description;
    weatherIconElement.setAttribute(
        'src',
        `https://openweathermap.org/img/wn/${dataShow.weather[0].icon}.png`
    );
    countryElement.setAttribute('src', apiCountryURL + dataShow.sys.country + apiCountryParams);
    humidityElement.innerHTML = `${dataShow.main.humidity}%`;
    windElement.innerHTML = `${dataShow.wind.speed}km/h`;

    // Change bg image using Lorem Picsum API
    document.body.style.backgroundImage = `url("${apiLoremPicsum}${city}")`;

    weatherContainer.classList.remove('hide');
};

// Eventos e input
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const city = cityInput.value.trim();

    if (city) {
        showWeatherData(city);
    }
});

cityInput.addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
        const city = e.target.value.trim();

        if (city) {
            showWeatherData(city);
        }
    }
});

// Sugestões
suggestionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const city = btn.getAttribute("id");

        showWeatherData(city);
    });
});
