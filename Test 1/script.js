const dropDown = document.querySelectorAll(".dropdown select"),
formCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getBtn = document.querySelector("form button"),
amount = document.querySelector(".amount input"),
exchangeRateText = document.querySelector(".message"),
exchangeIcon = document.querySelector(".dropdown .icon"),
apiKey = "99a0aec004527b1a155623da";

// Utility function to format numbers into scientific notation if needed
function formatResult(value) {
    if (value === 0) return '0';

    const absValue = Math.abs(value);
    if (absValue >= 1e15 || (absValue < 1e-10 && absValue > 0)) {
        return value.toExponential(2);
    }

    const integerValue = Math.floor(value);
    let formattedString = integerValue.toLocaleString('id-ID'); // Get initial formatting
    formattedString = formattedString.replace(".", "."); // Explicitly replace period with comma

    return formattedString;
}

for (let i = 0; i < dropDown.length; i++) {
    for (let currency_code in countryList) {
        let selected;
        if (i == 0) {
            selected = currency_code == "USD" ? "selected" : "";
        } else if (i == 1) {
            selected = currency_code == "IDR" ? "selected" : "";
        }

        let countryCode = countryList[currency_code];
        let countryName = countryNames[countryCode] || countryCode; // Gunakan nama negara atau kode negara jika nama tidak ditemukan
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code} - ${countryName}</option>`;
        dropDown[i].insertAdjacentHTML("beforeend", optionTag);
    }

    dropDown[i].addEventListener("change", e => {
        loadFlag(e.target);
    });
}

function loadFlag(element) {
    let imgTag = element.parentElement.querySelector("img");
    for (code in countryList) {
        if (code == element.value) {
            imgTag.src = (code === 'IDR') ? 
                'https://flagsapi.com/ID/flat/64.png' : 
                `https://flagsapi.com/${countryList[code]}/flat/64.png`;
        }
    }
}

window.addEventListener("load", () =>{
    getExchangeRate();
    loadFlag(toCurrency);
});

getBtn.addEventListener("click", e =>{
    e.preventDefault();
    getExchangeRate();
});

let rotationAngle = 0;

exchangeIcon.addEventListener("click", () => {
    let tempCode = formCurrency.value;
    formCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(formCurrency);
    loadFlag(toCurrency);
    getExchangeRate();

    rotationAngle = (rotationAngle === 0) ? 180 : 0;
    exchangeIcon.style.transform = `rotate(${rotationAngle}deg)`;
    exchangeIcon.style.transition = "transform 0.5s ease";    
});

function getExchangeRate() {
    let amountVal = parseFloat(amount.value);

    if (amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }

    exchangeRateText.innerHTML = '<i class="fa-solid fa-arrows-rotate rotation"></i>';

    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${formCurrency.value}`;

    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = amountVal * exchangeRate;

        let formattedExchangeRate = formatResult(totalExchangeRate);

        exchangeRateText.innerHTML = `${amountVal.toLocaleString("id-ID")} ${formCurrency.value} = ${formattedExchangeRate.toLocaleString("id-ID")} ${toCurrency.value}`;
    })
    .catch(error => {
        exchangeRateText.innerHTML = "Failed to get exchange rate..";
        console.error('Error fetching exchange rate:', error);
    });
}
