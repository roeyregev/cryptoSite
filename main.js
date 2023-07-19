"use strict";

(async () => {

    async function getJson(url) {
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.log("Something went Wrong: " + error)
        }
    }

    //Load homepage
    const coinsData = await getJson("coinsData.json");
    displayHomepage()
    const acceptBtn = document.getElementById("acceptBtn");
    const modalContainer = document.getElementById("modalContainer");

    //Search
    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");

    clearSearch.addEventListener("click", () => {
        searchInput.value = ``;
    })

    searchInput.addEventListener("input", () => {

        let searchQuery = searchInput.value.toLowerCase();
        console.log("Search query: " + searchQuery);
        let coinsCardsArray = document.getElementsByClassName("single_coins_card");

        for (let i = 0; i < coinsData.length; i++) {
            let index = i;
            const isVisible = coinsData[i].name.toLowerCase().includes(searchQuery) || coinsData[i].id.toLowerCase().includes(searchQuery);
            console.log(coinsData[i].name + ": " + isVisible);
            coinsCardsArray[index].classList.toggle("hide", !isVisible);

        }
    })

    //Navbar:
    const currenciesLink = document.getElementById("currenciesLink");
    const reportLink = document.getElementById("reportLink");
    const aboutLink = document.getElementById("aboutLink");
    const logoDiv = document.getElementById("logoDiv");

    logoDiv.addEventListener("click", () => {
        displayHomepage()
    })
    currenciesLink.addEventListener("click", () => {
        displayHomepage()
    })

    reportLink.addEventListener("click", () => {
        displayReportsPage()
    })

    aboutLink.addEventListener("click", () => {
        displayAboutPage()
    })

    // displayInModal()

    //------------------------------------------------------------------------
    //                                 FUNCTIONS
    //------------------------------------------------------------------------

    async function displayHomepage() {
        const pageContent = document.getElementById("pageContent");
        let html = `<div id="heroImageDiv"></div>
                    <div id="HomepageTypo">
                        <h1>Welcome to Crapto! <br>the crappy crypto page</h1>
                        <p>Ever needed a very partial info about only some of the 
                        cryptocurrencies out there? Ever wanted to see a very limited comparison 
                        chart? Ever looked for a place where you can't trade anything or be 
                        active in any way?
                        If you did, then Crapto is the place for you</p>
                    </div>
                    
                    <section id="currenciesContent">
                    `;

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
                       
                        <div class="favorite_icon" id="${i}">${favoritesIcon}</div>
                      
                        <div class="extra_info_div">
                            <div class="switch-container hide-rates">
                                <div class="market_content">
                                    <div>Market cap rank: ${coinsData[i].market_cap_rank}</div>
                                    <div>Market cap: ${(coinsData[i].market_cap / 1000000).toFixed(0)} M</div>
                                    <div>Circulating supply: ${(coinsData[i].circulating_supply / 1000000).toFixed(0)} M</div>
                                </div>
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
        let html = `<canvas id="myChart"></canvas>`
        pageContent.innerHTML = html;

        const ctx = document.getElementById('myChart');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['date1', 'date2', 'date3', 'date4', 'date4', 'date5', 'date6', 'date7', 'date8', 'date9', 'date10', 'date11', 'date12', 'date13', 'date14'],
                datasets: [{
                    label: 'Rate',
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 3
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    }

    async function displayAboutPage() {
        let html = `
                  <div class="about_typo"> 
                    <h1>About Crapto</h1>
                    <p>a few word about the about page</p>
                    <div>Image</div>
                  </div>
                 `
        pageContent.innerHTML = html;
    }

    //display more info in each card
    const switchInfoButtons = document.getElementsByClassName("switch-info");

    for (const button of switchInfoButtons) {
        button.addEventListener("click", async function () {
            const cardId = this.parentElement.parentElement.id;
            this.parentElement.children[0].classList.toggle("hide-market");
            this.parentElement.children[0].classList.toggle("hide-rates");
            const index = cardId.slice(6)

            let extraInfo;

            //check for existing data:
            const loadedExtraInfo = localStorage.getItem(`${coinsData[index].id} info`);
            if (loadedExtraInfo) {
                extraInfo = JSON.parse(loadedExtraInfo)
            } else {
                extraInfo = await getJson(`https://api.coingecko.com/api/v3/coins/${coinsData[index].id}`);

                //save
                let extraInfoString = JSON.stringify(extraInfo);
                localStorage.setItem(`${coinsData[index].id} info`, extraInfoString);

                //remove from storage after 2 min
                setTimeout(() => {
                    localStorage.removeItem(`${coinsData[index].id} info`);
                }, 120 * 1000);
            }

            //inject html
            let html = `
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

    //Favorites
    let favorites = [];

    const favoriteButtons = document.getElementsByClassName("favorite_icon");
    // console.log(favoriteButtons);

    for (const button of favoriteButtons) {
        button.addEventListener("click", function () {
            

            if (!favorites.includes(this.id)) {
                favorites.push(this.id);
                console.log(favorites);
            } else {
                const index = favorites.indexOf(this.id);
                favorites.splice(index, 1);
                console.log(favorites);
            }
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
            // console.log("item: " + item);
            favoriteButtons[item].classList.toggle("favorite-on")
        }
    }


    //display
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
        
                            <div class="favorite-icon-modal favorite-on" id="modalStar#${item}">${favoritesIcon}</div>
                         </div>
                     </div>
                   `
        }
        coinsModalListContainer.innerHTML = html;

    }

    //modify favorites in modal
    function updateModalFavorites() {


        const modalStars = document.getElementsByClassName("favorite-icon-modal");
        // console.log(modalStars);

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
        favoriteOn()
    })

    function isDisplayModal() {
        if (favorites.length > 5) {
            favorites.splice(5,1);
            favoriteOn();
            modalContainer.classList.remove("hide");
            
           
        }
    }




})();









// "https://api.coingecko.com/api/v3/coins/${coin id}" -> for "more info"

// const coinsRatesArr = await getJson("https://api.coingecko.com/api/v3/coins/usd");
 // const coinsRatesArr = await getJson("usd.json");

 // <div class="slider_div">
//     <div class="icon_arrow left"></div>
//     <div class="dot dot-on"></div>
//     <div class="dot dot-off"></div>
//     <div class="icon_arrow right"></div>
// </div>