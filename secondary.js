"use strict";

(() => {
    //Load homepage
    async function loadHomePage() {
        const coinsDataArr = await getJson("coinsData.json");
        DisplayCoinsGrid(coinsDataArr);
     }

   loadHomePage();



    //dynamic html navbar link:
    const pageContent = document.getElementById("pageContent");
    const currenciesContent = document.getElementById("currenciesContent");

    const currenciesLink = document.getElementById("currenciesLink");
    const reportLink = document.getElementById("reportLink");
    const aboutLink = document.getElementById("aboutLink");

    currenciesLink.addEventListener("click", () => {
        pageContent.innerHTML = `<div id="heroImageDiv">Hero image</div>
                                 <section id="currenciesContent">Coins data</section>
                                 `;
    })

    reportLink.addEventListener("click", () => {
        pageContent.innerHTML = `<div><h1>Reports page goes here</h1></div>`;
    })
    aboutLink.addEventListener("click", () => {
        pageContent.innerHTML = `<div><h1>About page goes here</h1></div>`;
    })




    const coinsRates = getJson("https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,JPY,EUR&api_key=baff779ee95fa76b92671c67c554932a20016fd7839e8fb33f37e8b62001d73a");
    const mainSectionContainer = document.getElementById("mainSectionContainer");





  

})();
