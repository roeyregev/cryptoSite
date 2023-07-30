"use strict";

(async () => {

    for (let i = sessionStorage.length - 1; i >= 0; i--) {
        if (sessionStorage.key(i).includes("info")) {
            console.log(sessionStorage.key(i));
            sessionStorage.removeItem(sessionStorage.key(i));
        }
    }

    async function getJson(url) {
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.log("Something went Wrong; Couldn't get response " + error)
        }
    }

    // homepage - first load
    let chartInterval;
    let favorites = [];
    let coinsData;
    const pageLoader = document.getElementById("pageLoader");

    const loadedCoinsData = sessionStorage.getItem("Coins data");
    if (loadedCoinsData) {
        coinsData = JSON.parse(loadedCoinsData)
    } else {
        pageLoader.style.display = "flex";
        // coinsData = await getJson("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1");
        coinsData = await getJson("coinsData.json");
        pageLoader.style.display = "none";
        const storedCoinsData = JSON.stringify(coinsData);
        sessionStorage.setItem("Coins data", storedCoinsData);
    }

    displayHomepage()
    moreInfo()
    const acceptBtn = document.getElementById("acceptBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modalContainer = document.getElementById("modalContainer");

    //Search
    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");
    clearSearch.addEventListener("click", () => {
        searchInput.value = ``;
        searchQuery()
    })

    searchInput.addEventListener("input", () => {
        searchQuery()
    })

    function searchQuery(){
        let searchQuery = searchInput.value.toLowerCase();
        console.log("Search query: " + searchQuery);
        let coinsCardsArray = document.getElementsByClassName("single_coins_card");
        for (let i = 0; i < coinsData.length; i++) {
            let index = i;
            const isVisible = coinsData[i].name.toLowerCase().includes(searchQuery) 
            || coinsData[i].id.toLowerCase().includes(searchQuery) 
            || coinsData[i].symbol.toLowerCase().includes(searchQuery);
            console.log(coinsData[i].name + ": " + isVisible);
            coinsCardsArray[index].classList.toggle("hide", !isVisible);
        }
    }

    //Navbar:
    const currenciesLink = document.getElementById("currenciesLink");
    const reportLink = document.getElementById("reportLink");
    const aboutLink = document.getElementById("aboutLink");
    const logoDiv = document.getElementById("logoDiv");

    logoDiv.addEventListener("click", () => {
        displayHomepage()
        moreInfo()
    })

    currenciesLink.addEventListener("click", () => {
        displayHomepage()
        moreInfo()
        loadFavorites()
        saveFavorites()
    })

    reportLink.addEventListener("click", () => {
        displayReportsPage()
    })

    aboutLink.addEventListener("click", () => {
        displayAboutPage()
    })


    async function displayHomepage() {
        clearInterval(chartInterval);
        console.log("favorites: " + favorites)
        const currenciesLink = document.getElementById("currenciesLink");
        currenciesLink.focus()

        const pageContent = document.getElementById("pageContent");
        let html = `<div id="heroImageDiv">
                        <div id="layer1"></div>
                    </div>
                    <div id="HomepageTypo">
                        <h1>Welcome to Crapto! <br>the crappy crypto page</h1>
                        <p>Ever needed a very partial info about only some of the 
                        cryptocurrencies out there? Ever wanted to see a very limited comparison 
                        chart? Ever looked for a place where you can't trade anything or be 
                        active in any way?
                        If you did, then Crapto is the place for you</p>
                    </div>                    
                    <section id="currenciesContent">`;

        function showContent(i) {
            return ` <div class="market_content">
                        <div>Market cap rank: ${coinsData[i].market_cap_rank}</div>
                        <div>Market cap: ${(coinsData[i].market_cap / 1000000).toFixed(0)} M</div>
                        <div>Circulating supply: ${(coinsData[i].circulating_supply / 1000000).toFixed(0)} M</div>
                    </div>`
        }

        function showLoader() {
            return ` <div class="preloader hide">
                        <div><div class="preloader-line">XXXXXXXXXXX</div> </div>
                        <div><div class="preloader-line">XXXXXXXXXXX</div> </div>
                        <div><div class="preloader-line">XXXXXXXXXXX</div> </div>
                    </div>`
        }

        if (coinsData && coinsData.length) {
            for (let i = 0; i < 50; i++) {
                html += `
                    <div class="single_coins_card" id="cardId${i}">
                        <div class="icon_and_symbol">
                            <div class = "coin_icon"><img class = "coin_icon" src="${coinsData[i].image}" alt="${coinsData[i].id}"> </div>
                            <div class="symbol_and_id">
                                <p class="coin_symbol"> ${coinsData[i].symbol}</p>
                                <p class="coin_id"> ${coinsData[i].id}</p>
                            </div>
                        </div>                      
                        <div class="favorite_icon" id="${i}"></div>                       
                        <div class="extra_info_div">
                            <div class="switch-container hide-rates">
                            ${showLoader()}
                            ${showContent(i)}                           
                            </div>                           
                            <button class="switch-info" id="moreInfo_${coinsData[i].id}">Switch info</button>                          
                        </div>                       
                    </div>
                    `
            }

        } else {
            html += `<div>BUG!</div>`;
        }
        html += `</section>`;
        pageContent.innerHTML = html;
    };

    async function displayReportsPage() {

        let html = `<h1 id="reportTitle">Your favorites in USD rates </h1>
                    <div id="chartContainer"><canvas id="myChart"></canvas></div>`
        pageContent.innerHTML = html;

        refreshChartData();
    }

    async function refreshChartData() {
        const chartContainer = document.getElementById("chartContainer");

        //temp favorites:
        favorites = [0, 1, 2, 8, 10];

        let chartData = [];
        let timeStamps = [];

        //inject string into API link
        let chartSymbols = [];
        favorites.forEach(value => {
            chartSymbols.push(coinsData[value].symbol.toUpperCase());
        });

        const apiString = chartSymbols.join();
        const chartApiData = await getJson(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${apiString}&tsyms=USD`);

        chartInterval = setInterval(() => {
            let currentTime = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
            console.log(currentTime)


            if (chartData.length < 30) {
                chartData.push(chartApiData);
                // timeStamps.pop()
                timeStamps.push(currentTime);

            } else {
                chartData.pop();
                chartData.push(chartApiData);
                timeStamps.pop()
                timeStamps.push(currentTime);
            }

            //just checking...
            console.log("chart BTC symbol: " + Object.keys(chartData[0])[0]);
            console.log("chart BTC rate: " + chartData[0][Object.keys(chartData[0])[0]].USD)

            //organizing the data:
            let dataSet0 = [];
            for (let i = 0; i < chartData.length; i++) {
                dataSet0.push(chartData[i][Object.keys(chartData[i])[0]].USD);
            }

            let dataSet1 = [];
            for (let i = 0; i < chartData.length; i++) {
                dataSet1.push(chartData[i][Object.keys(chartData[i])[1]].USD);
            }

            let dataSet2 = [];
            for (let i = 0; i < chartData.length; i++) {
                dataSet2.push(chartData[i][Object.keys(chartData[i])[2]].USD);
            }

            let dataSet3 = [];
            for (let i = 0; i < chartData.length; i++) {
                dataSet3.push(chartData[i][Object.keys(chartData[i])[3]].USD);
            }

            let dataSet4 = [];
            let label4 = ``;
            if (chartData.length >= 5) {
                for (let i = 0; i < chartData.length; i++) {
                    dataSet4.push(chartData[i][Object.keys(chartData[i])[4]].USD);
                    label4 = chartSymbols[4];
                }

            } else {
                dataSet4 = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",];
                label4 = "None";
            }

            //chart component:
            chartContainer.innerHTML = html;
            const ctx = document.getElementById('myChart');

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timeStamps,
                    // labels: ["1 min ago", "", "", "", "", "", "", "", "", "", "", "", "", "", "30 sec ago", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Now"],
                    datasets: [{
                        label: chartSymbols[0],
                        data: dataSet0,
                        // data: [10, 20, 30, 20, 10, 20, 30, 20, 10, 20, 30, 20, 10, 100],
                        borderWidth: 3
                    },
                    {
                        // label: Object.keys(chartData[0])[1],
                        label: chartSymbols[1],
                        data: dataSet1,
                        borderWidth: 3
                    },
                    {
                        label: chartSymbols[2],
                        data: dataSet2,
                        borderWidth: 3
                    },
                    {
                        label: chartSymbols[2],
                        data: dataSet2,
                        borderWidth: 3
                    },
                    {
                        label: chartSymbols[4],
                        data: dataSet4,
                        borderWidth: 3
                    },
                    ]
                },

                options: {
                    responsive: true,
                    scales: {
                        x: {
                            grid: {
                                color: `rgba(255,255,255,0.05)`
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: `rgba(255,255,255,0.05)`
                            }
                        }
                    },
                    display: true,
                    animations: false,
                    layout: {
                        padding: 4
                    },


                }
            });

        }, 2000)

        let html = `<canvas id="myChart"></canvas>`;
    }

    // refreshChartData()
    //-------------------------------------------------------------------------------

    async function displayAboutPage() {
        clearInterval(chartInterval);

        let html = `
                <div class="about-container">
                        <div class="about_typo"> 
                            <h1>About Crapto</h1>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                            
                        </div>
                        <div>
                        <span>Contact us at</span> <a>contact@crapto.com</a>
                        </div>
                        <div id="aboutImage"></div>
                </div>
                 `
        pageContent.innerHTML = html;
    }

    //display more info in each card
    async function moreInfo() {
        const switchInfoButtons = document.getElementsByClassName("switch-info");

        for (const button of switchInfoButtons) {
            button.addEventListener("click", async function () {

                const cardId = this.parentElement.parentElement.id;
                this.parentElement.children[0].classList.toggle("hide-market");
                this.parentElement.children[0].classList.toggle("hide-rates");

                const index = cardId.slice(6)

                let extraInfo;

                //check for existing data:
                const loadedExtraInfo = sessionStorage.getItem(`${coinsData[index].id} info`);
                if (loadedExtraInfo) {
                    extraInfo = JSON.parse(loadedExtraInfo)
                } else {
                    // //preloader div
                    this.parentElement.children[0].children[0].classList.remove("hide");
                    extraInfo = await getJson(`https://api.coingecko.com/api/v3/coins/${coinsData[index].id}`);

                    //save
                    let extraInfoString = JSON.stringify(extraInfo);
                    sessionStorage.setItem(`${coinsData[index].id} info`, extraInfoString);

                    //remove from storage after 2 min
                    setTimeout(() => {
                        sessionStorage.removeItem(`${coinsData[index].id} info`);
                    }, 120 * 1000);
                }

                //inject html
                let html = `
                            <div class="preloader hide">
                                <div><div class="preloader-line">XXXXXXXXXXX</div> </div>
                                <div><div class="preloader-line">XXXXXXXXXXX</div> </div>
                                <div><div class="preloader-line">XXXXXXXXXXX</div> </div>
                            </div>

                            <div class="market_content">
                                <div>Market cap rank: ${coinsData[index].market_cap_rank}</div>
                                <div>Market cap: ${(coinsData[index].market_cap / 1000000).toFixed(0)} M</div>
                                <div>Circulating supply: ${(coinsData[index].circulating_supply / 1000000).toFixed(0)} M</div>
                            </div> 

                            <div class="rates_content">
                                <div>USD: ${extraInfo.market_data.current_price.usd}</div>
                                <div>EUR: ${extraInfo.market_data.current_price.eur}</div>
                                <div>ILS: ${extraInfo.market_data.current_price.ils}</div>
                            </div>
                        `;
                this.parentElement.children[0].innerHTML = html
            })
        }
    }

    //Favorites
    function loadFavorites() {
        let loadedFavorites = sessionStorage.getItem("saved favorites");
        if (loadedFavorites) {
            favorites = JSON.parse(loadedFavorites);
            // console.log("loaded favorites: " + favorites)
        } else {
            favorites = []
        }
    }

    function saveFavorites() {
        let savedFavorites = JSON.stringify(favorites);
        sessionStorage.setItem("saved favorites", savedFavorites);
    }
    
    const favoriteButtons = document.getElementsByClassName("favorite_icon");
    for (const button of favoriteButtons) {
        loadFavorites()
        favoriteOn();
        button.addEventListener("click", function () {

            if (!favorites.includes(this.id)) {
                favorites.push(this.id);
                console.log(favorites);
            } else {
                const index = favorites.indexOf(this.id);
                favorites.splice(index, 1);
                console.log(favorites);
            }
            saveFavorites()
            favoriteOn();
            displayModal();
            updateModalFavorites()
        })
    }

    function favoriteOn() {
        for (const button of favoriteButtons) {
            button.classList.remove("favorite-on")
        }
        for (const item of favorites) {
            favoriteButtons[item].classList.toggle("favorite-on")
        }
    }

    //display modal
    function displayModal() {
        isDisplayModal()
        const coinsModalListContainer = document.getElementById("coinsModalListContainer");

        let html = ``;
        for (const item of favorites) {
            html += `
                     <div class="modal-list-item">        
                         <div class="icon_and_symbol">
                            <div class = "coin_icon"><img class = "coin_icon" src="${coinsData[item].image}" alt="${coinsData[item].id}"> </div>
                            <div class="symbol_and_id">
                                 <p class="coin_symbol"> ${coinsData[item].symbol}</p>
                                <p class="coin_id"> ${coinsData[item].id}</p>
                            </div>        
                            <div class="favorite-icon-modal favorite-on" id="modalStar#${item}"></div>
                         </div>
                     </div>
                   `
        }
        coinsModalListContainer.innerHTML = html;
    }

    //modify favorites in modal
    function updateModalFavorites() {

        const modalStars = document.getElementsByClassName("favorite-icon-modal");

        for (const star of modalStars) {
            star.addEventListener("click", function () {
                let coinId = this.id.slice(10)
                console.log(coinId);

                if (!favorites.includes(coinId)) {

                    favorites.push(coinId);
                    console.log(favorites);
                } else {
                    const index = favorites.indexOf(coinId);
                    favorites.splice(index, 1);
                    console.log(favorites);
                }
                modalFavoriteOn(favorites, modalStars);
                saveFavorites();
            })
        }
    }

    function modalFavoriteOn(favorites, modalStars) {

        for (const button of modalStars) {
            button.classList.remove("favorite-on")
        }

        for (const item of favorites) {
            let starID = `modalStar#${item}`
            for (const star of modalStars) {
                if (star.id == starID) {
                    star.classList.toggle("favorite-on");
                }
            }
        }
    }

    acceptBtn.addEventListener("click", function () {
        this.parentElement.parentElement.classList.add("hide");
        if (favorites.length === 6) {
            favorites.pop()
        };
        saveFavorites();
        console.log(favorites);
        favoriteOn();
    })

    closeModalBtn.addEventListener("click", function () {
        this.parentElement.parentElement.classList.add("hide");
    })

    function isDisplayModal() {
        if (favorites.length > 5) {
            favorites.splice(5, 1);
            favoriteOn();
            modalContainer.classList.remove("hide");
        }
    }

})();


// "https://api.coingecko.com/api/v3/coins/${coin id}" -> for "more info"