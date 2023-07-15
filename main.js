"use strict";

(async () => {

    //Load homepage
    let favorites = [];
    const coinsDataArr = await getJson("coinsData.json");

    displayHomepage()


    //dynamic html navbar:
    // const pageContent = document.getElementById("pageContent");

    const currenciesLink = document.getElementById("currenciesLink");
    const reportLink = document.getElementById("reportLink");
    const aboutLink = document.getElementById("aboutLink");

    currenciesLink.addEventListener("click", () => {
        displayHomepage()
    })

    reportLink.addEventListener("click", () => {
        displayReportsPage()
    })

    aboutLink.addEventListener("click", () => {
        displayAboutPage()
    })

    displayInModal()
    

    //------------------------------------------------------------------------
    //                                 FUNCTIONS
    //------------------------------------------------------------------------

    async function getJson(url) {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json);
        return json;
    }

    async function displayHomepage() {
        // const coinsDataArr = await getJson("coinsData.json");
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
        for (let i = 0; i < 50; i++) {
            html += `
                    <div class="single_coins_card">
                        <div class="icon_and_symbol">
                            <div class = "coin_icon"><img class = "coin_icon" src="${coinsDataArr[i].image}" alt="${coinsDataArr[i].id}"> </div>
                            <div class="symbol_and_id">
                                <p class="coin_symbol"> ${coinsDataArr[i].symbol}</p>
                                <p class="coin_id"> ${coinsDataArr[i].id}</p>
                            </div>
                        </div>
                       
                        <div class="favorite_icon" id="${i}">${favoritesIcon}</div>
                      
                        <div class="extra_info_div">
                           
                            <div class="changing_content">
                            <div>Market cap rank: ${coinsDataArr[i].market_cap_rank}</div>
                                <div>Market cap: ${(coinsDataArr[i].market_cap / 1000000).toFixed(0)} M</div>
                                <div>Circulating supply: ${(coinsDataArr[i].circulating_supply / 1000000).toFixed(0)} M</div>
                            </div>

                            <div class="slider_div">
                                <div class="icon_arrow left"></div>
                                <div class="dot dot-on"></div>
                                <div class="dot dot-off"></div>
                                <div class="icon_arrow right"></div>
                            </div>
                        </div>
                    </div>
                    `
        }
        html += `</section>`;

        pageContent.innerHTML = html;

        addToFavorites();
    };

   



    async function displayReportsPage() {
        let html = `
                  <div class="chart"></div>
                  <div class="favorites_list">
                  <div>coin 1</div>
                  <div>coin 2</div>
                  <div>coin 3</div>
                  <div>coin 4</div>
                  <div>coin 5</div>
                  </div>
                 `
        pageContent.innerHTML = html;
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

    //toggle favorites buttons
    function addToFavorites() {
        const favoriteIconsArray = document.getElementsByClassName("favorite_icon");
        // console.log(favoriteIconsArray);
        for (let i = 0; i < favoriteIconsArray.length; i++) {
            favoriteIconsArray[i].addEventListener("click", function () {
                favoriteIconsArray[i].classList.toggle("favorite-on");
                console.log(i);
                updateFavoritesArray()
                displayInModal()
            })
        }

    }

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
    function displayInModal() {
        
        const coinsModalListContainer = document.getElementById("coinsModalListContainer");

        let html = ``;
        for (const item of favorites) {
            html += `
                        <div class="modal-list-item">
                 
                                <div class="icon_and_symbol">
                                    <div class = "coin_icon"><img class = "coin_icon" src="${coinsDataArr[item].image}" alt="${coinsDataArr[item].id}"> </div>
                                    <div class="symbol_and_id">
                                        <p class="coin_symbol"> ${coinsDataArr[item].symbol}</p>
                                        <p class="coin_id"> ${coinsDataArr[item].id}</p>
                                    </div>
                                                   
                                <div class="favorite-icon-modal favorite-on-modal" id="${item}">${favoritesIcon}</div>
                            </div>
                        </div>
                        `
        }
        coinsModalListContainer.innerHTML = html;
        
    }

    //toggle favorite icons in modal and removes the relevant item from the array
    function toggleIconsInModal() {
        console.log("favorites before delete: " + favorites);

        const modalFavoriteIconsArray = document.getElementsByClassName("favorite-icon-modal");

        for (let i = 0; i < modalFavoriteIconsArray.length; i++) {

            modalFavoriteIconsArray[i].addEventListener("click", function () {
                //toggle class and icon
                modalFavoriteIconsArray[i].classList.toggle("favorite-on-modal");

                //remove from favorites array
                const itemToDelete = this.id;
                favorites.splice(favorites.indexOf(itemToDelete), 1);
                console.log("item to delete: " + itemToDelete);
                console.log("favorites after delete: " + favorites);
                
            })
           

        }


    };






})();

