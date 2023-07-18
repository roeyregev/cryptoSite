// "https://api.coingecko.com/api/v3/coins/${coin id}" -> for "more info"


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
    let favorites = [];
    const coinsData = await getJson("coinsData.json");
    displayHomepage()

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

        // addToFavorites();
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

    // function loadChart() {

    // }

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

    //toggle favorites buttons
    // function addToFavorites() {
    //     const favoriteIconsArray = document.getElementsByClassName("favorite_icon");
    //     // console.log(favoriteIconsArray);
    //     for (let i = 0; i < favoriteIconsArray.length; i++) {
    //         favoriteIconsArray[i].addEventListener("click", function () {
    //             favoriteIconsArray[i].classList.toggle("favorite-on");
    //             console.log(i);
    //             updateFavoritesArray()
    //             displayInModal()
    //         })
    //     }

    // }

    //updates the favorites array itself
    function updateFavoritesArray() {
        favorites = [];
        let selectedFavorites = document.getElementsByClassName("favorite-on");
        for (const item of selectedFavorites) {
            let index = item.id;
            favorites.push(index);
        }
        console.log("updated favorites array: " + favorites);
        return favorites;
    }

    //take the favorites array and display it in the modal
    // function displayInModal() {

    //     const coinsModalListContainer = document.getElementById("coinsModalListContainer");

    //     let html = ``;
    //     for (const item of favorites) {
    //         html += `
    //                     <div class="modal-list-item">

    //                             <div class="icon_and_symbol">
    //                                 <div class = "coin_icon"><img class = "coin_icon" src="${coinsDataArr[item].image}" alt="${coinsDataArr[item].id}"> </div>
    //                                 <div class="symbol_and_id">
    //                                     <p class="coin_symbol"> ${coinsDataArr[item].symbol}</p>
    //                                     <p class="coin_id"> ${coinsDataArr[item].id}</p>
    //                                 </div>

    //                             <div class="favorite-icon-modal favorite-on-modal" id="${item}">${favoritesIcon}</div>
    //                         </div>
    //                     </div>
    //                     `
    //     }
    //     coinsModalListContainer.innerHTML = html;

    // }

    //toggle favorite icons in modal and removes the relevant item from the array
    // function toggleIconsInModal() {
    //     console.log("favorites before delete: " + favorites);

    //     const modalFavoriteIconsArray = document.getElementsByClassName("favorite-icon-modal");

    //     for (let i = 0; i < modalFavoriteIconsArray.length; i++) {

    //         modalFavoriteIconsArray[i].addEventListener("click", function () {
    //             //toggle class and icon
    //             modalFavoriteIconsArray[i].classList.toggle("favorite-on-modal");

    //             //remove from favorites array
    //             const itemToDelete = this.id;
    //             favorites.splice(favorites.indexOf(itemToDelete), 1);
    //             console.log("item to delete: " + itemToDelete);
    //             console.log("favorites after delete: " + favorites);

    //         })


    //     }


    // };


    // const coinsRatesArr = await getJson("https://api.coingecko.com/api/v3/coins/usd");
    // const coinsRatesArr = await getJson("usd.json");




    //display more info in each card
    const switchInfoButtons = document.getElementsByClassName("switch-info");

    for (const button of switchInfoButtons) {
        button.addEventListener("click", async function () {
            const cardId = this.parentElement.parentElement.id;
            this.parentElement.children[0].classList.toggle("hide-market");
            this.parentElement.children[0].classList.toggle("hide-rates");

            //fetch relevant data
            const index = cardId.slice(6)
            const extraInfo = await getJson(`https://api.coingecko.com/api/v3/coins/${coinsData[index].id}`);

            //session storage:


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

})();





// <div class="slider_div">
//     <div class="icon_arrow left"></div>
//     <div class="dot dot-on"></div>
//     <div class="dot dot-off"></div>
//     <div class="icon_arrow right"></div>
// </div>