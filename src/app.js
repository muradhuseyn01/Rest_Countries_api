const modeBtn = document.querySelector('.container__head-mode');
const modeText = document.querySelector('.container__head-mode>span');
const modeIcon = document.querySelector('.container__head-mode>i');
const containerCountry = document.querySelector('.container__country');
const containerFilter = document.querySelector('.container__title-filter-in');
const filterIcon = document.querySelector('.container__title-filter-in>i');
const contRegion = document.querySelector('.cont-region');
const searchInput = document.querySelector('#txt-search');
const countryInfoMain = document.querySelector('.country__info-main');
const btnAll = document.querySelectorAll('.check');
const root = document.querySelector(':root');

let allData;

function getUrl() {
    let url = new URLSearchParams(window.location.search);
    let urlName = url.get('name');
    let pageName = window.location.pathname.split('/').pop();
    return {
        pageName: pageName,
        urlName: urlName,
    }
}
let pageUrl = getUrl();

if (pageUrl.pageName == 'index.html') {
    getAllCountry();
    searchCountry();
    activeFilterRegion();

    mode();
}
if (pageUrl.pageName == 'detail.html') {
    mode(); getDetailInnerData()
}

function getAllCountry() {
    fetch('https://restcountries.com/v3.1/all')
        .then(res => res.json())
        .then(data => {
            allData = data;
            getData(data);
        });
}

btnAll.forEach((button) => {
    button.addEventListener('click', (e) => {
        let btnTextcontent = button.textContent;
        let checkRegion = filterData(btnTextcontent, "region", allData);
        getData(checkRegion);
    })
})

function filterData(value, key, data) {
    value = value.toLowerCase();
    const currentData = data.filter(item => {
        const currentItem = item[key].toLowerCase();
        return currentItem.includes(value);
    })
    return currentData;
}

function filterInnerData(value, key, inner, data) {
    value = value.toLowerCase();
    const currentInnerData = data.filter(item => {
        const currentInnerItem = item[key][inner].toLowerCase();
        return currentInnerItem.includes(value);
    })
    return currentInnerData;
}

function filtersRegion(region) {
    fetch(`https://restcountries.com/v3.1/region/${region}`)
        .then((res) => res.json())
        .then(getData);
}

function getData(x) {
    containerCountry.innerHTML = '';
    x.map((item) => {
        const mainCard = document.createElement('a');
        mainCard.classList.add('container__country-main');
        mainCard.href = `/detail.html?name=${item.name.common}`
        mainCard.innerHTML += `
                    <div class="container__country-img">
                        <img src="${item.flags.png}" alt="photo">
                    </div>
                    <div class="container__country-details">
                        <h3>${item.name.common.substring(0, 20)}</h3>
                        <p><b>Population:</b> ${item.population.toLocaleString('en-AZ')}</p>
                        <p><b>Region:</b> ${item.region}</p>
                        <p><b>Capital:</b> ${item.capital}</p>
                    </div>
                `
        containerCountry.appendChild(mainCard);
    })
}

function getDetailInnerData() {
    fetch("https://restcountries.com/v3.1/name/" + pageUrl.urlName)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let findData = data.find(item => item.name.common == pageUrl.urlName);
            countryInfoMain.innerHTML = '';
            countryInfoMain.innerHTML += `
        <div class="country__info-main-img">
                    <img src="${findData.flags.png}" alt="photo">
                </div>

                <div class="country__info-main-details">
                    <h3>${findData.name.common}</h3>
                    <div class="country__details">
                        <div class="country__detail-left">
                            <p><b>Native Name:</b> ${findData.name.common}</p>
                            <p><b>Population:</b> ${findData.population.toLocaleString('en-AZ')}</p>
                            <p><b>Region:</b> ${findData.region}</p>
                            <p><b>Sub Region:</b> ${findData.subregion}</p>
                            <p><b>Capital:</b> ${findData.capital}</p>
                        </div>

                        <div class="country__detail-right">
                            <p><b>Top Level Domain:</b> .be</p>
                            <p><b>Currencies:</b> ${Object.values(findData.currencies)[0].name}</p>
                            <p><b>Languages:</b> ${Object.values(findData.languages).map(lang => {
                return lang;
            }).join(', ')}</p>
                        </div>
                    </div>

                    <div class="country__detail-footer">
                        <p>Border Countries:</p>
                        <div class="country__detail-footer-borders">
                        </div>
                    </div>
                </div>
        `
            getBorders(findData)
        })
}

function getBorders(findData) {
    let footerBorders = document.querySelector(".country__detail-footer-borders");
    if (findData.borders) {
        Object.values(findData.borders).forEach(border => {
            fetch("https://restcountries.com/v3.1/alpha/" + border)
                .then((response) => response.json())
                .then(([data]) => {
                    const borderLink = document.createElement("a");
                    borderLink.innerText = data.name.common;
                    footerBorders.append(borderLink);
                    borderLink.href = `detail.html?name=${data.name.common}`
                })
        })
    }
}

function searchCountry() {
    searchInput.addEventListener('input', (e) => {
        //let searchData = allData.filter(item => {
        //  let nameCommon = item.name.common.toUpperCase();
        //  return nameCommon.includes(e.target.value.toUpperCase());
        //   })
        let searchData = filterInnerData(e.target.value, "name", "common", allData);
        getData(searchData);
    })
}

function activeFilterRegion() {
    containerFilter.addEventListener('click', (e) => {
        contRegion.classList.toggle('display');
        filterIcon.classList.toggle('transform');
    })
}

function mode() {
    modeBtn.addEventListener('click', (e) => {
        modeBtn.classList.toggle('active');
        if (!modeBtn.classList.contains('active')) {
            localStorage.setItem('theme', 'light');
            modeText.textContent = 'Dark Mode';
            modeIcon.classList.replace('fa-solid', 'fa-regular');
            root.style.setProperty('--bg-main-color', '#FFFFFF');
            root.style.setProperty('--text-dark', ' #111517');
        } else {
            localStorage.setItem('theme', 'dark');
            modeText.textContent = 'Light Mode';
            modeIcon.classList.replace('fa-regular', 'fa-solid');
            root.style.setProperty('--bg-main-color', '#202C36');
            root.style.setProperty('--text-dark', ' #FFFFFF');
        }
    })
}
