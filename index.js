"use strict";
(function() {
  const BASE_URL = "https://www.cheapshark.com/api/1.0/";

  window.addEventListener("load", init);

  function init() {
    currentDate();
    makeRequestDeal();
    id("search-btn").addEventListener("click", searchList);
    id("back-btn").addEventListener("click", backToMain);
  }

  function toggleViews() {
    id("deal-view").classList.toggle("hidden");
    id("detail-view").classList.toggle("hidden");
  }

  function makeRequestDeal() {
    let url = urlPreparerDeal();
    fetch(url)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(processDataDeal)
      .catch(handleError);
  }

  function makeRequestDetail(id) {
    let url = urlPreparerGame(id);
    fetch(url)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(processDataGame)
      .catch(handleError);
  }

  async function statusCheck(resp) {
    if (!resp.ok) {
      throw new Error(await resp.text());
    }
    return resp;
  }

  function handleError(err) {
    let error = gen("p");
    error.textContent = "Error happens during Data processing";
    let message = gen("p");
    message.textContent = "Error reason: " + err;
    let view;
    if (id("details-bar").classList.contains("hidden")) {
      view = id("current-view");
    } else {
      view = id("details-bar");
    }
    view.innerHTML = "";
    view.appendChild(error);
    view.appendChild(message);
  }

  function processDataDeal(resp) {
    for (let i = 0; i < resp.length; i++) {
      console.log(resp.length);
      let data = resp[i];
      let container = gen("div");
      let left = gen("p");
      let right = gen("p");
      let img = gen("img");
      img.src = data.thumb;
      img.alt = data.title;
      left.textContent = data.title;
      messageMaker(right, data);
      container.id = data.gameID;
      container.appendChild(img);
      container.appendChild(left);
      container.appendChild(right);
      container.addEventListener("click", showDetail);
      container.classList.add("card");
      id("current-view").appendChild(container);
    }
  }

  function messageMaker(right, data) {
    right.textContent = "Deal Price: " + data.salePrice + "(" + data.normalPrice + ")";
    let options = qs("select");
    if (options[options.selectedIndex].value === "dealRating") {
      right.textContent += " Deal Rate: " + data.dealRating + "/10";
    } else if (options[options.selectedIndex].value === "metacritic") {
      right.textContent += " Metacritic Score: " + data.metacriticScore;
    } else if (options[options.selectedIndex].value === "reviews") {
      right.textContent += " Positive Review Rate: " + data.steamRatingPercent + "%";
    } else {
      right.textContent += " Saving Percentage: " + Math.floor(data.savings) + "%";
    }
  }

  function processDataGame(resp) {
    let information = resp["info"];
    let cheapest = resp["cheapestPriceEver"];
    let img = gen("img");
    img.src = "https://cdn.cloudflare.steamstatic.com/steam/apps/";
    img.src += information.steamAppID + "/header.jpg";
    img.alt = information.title;
    let link = gen("a");
    link.href = "https://store.steampowered.com/app/"
    link.href += information.steamAppID;
    link.textContent = "Click this link to view the game in store.";
    link.target = "_blank";
    id("image").appendChild(img);
    id("title").textContent = "Game Title: " + information.title;
    id("title").textContent += "(" + information.steamAppID + ")";
    id("steam").appendChild(link);
    id("cheapest").textContent = "Cheapest price: " + cheapest.price + " dollars";
    id("suggestion").textContent = "Visiting the store for more information";
    id("suggestion").textContent += " or using the back button to go back."
  }

  function urlPreparerDeal() {
    let url = BASE_URL + "deals?storeID=1&pageSize=30"
    let onSale = "&onSale=" + qs('input[type="radio"]:checked').value;
    let options = qs("select");
    let sortBy = "&sortBy=" + options[options.selectedIndex].value;
    if (options[options.selectedIndex].value === "dealRating") {
      sortBy = "";
    }
    let name = "";
    if (id("name").value !== "") {
      name = "&title=" + id("name").value;
    }
    let lowerPrice = "&lowerPrice=" + id("lower").value;
    let upperPrice = "&upperPrice=" + id("upper").value;
    url = url + sortBy + name + lowerPrice + upperPrice + onSale;
    return url;
  }

  function showDetail() {
    toggleViews();
    let id = this.id;
    makeRequestDetail(id);
  }

  function urlPreparerGame(id) {
    console.log(id);
    let url = BASE_URL + "games?id=" + id;
    return url;
  }

  function searchList() {
    id("current-view").innerHTML = "";
    makeRequestDeal();
  }

  function backToMain() {
    let information = qsa("#details-bar li");
    for (let i=0; i < information.length; i++) {
      information[i].innerHTML = "";
    }
    toggleViews();
  }

  function currentDate() {
    let date = new Date().toLocaleDateString();
    id("date").textContent = date;
  }

  /* --- CSE 154 HELPER FUNCTIONS --- */
  /**
   * Returns the DOM object with the given id attribute.
   * @param {string} name - element ID
   * @returns {object} DOM object associated with id (null if not found).
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns the first DOM object that match the given selector.
   * @param {string} selector - query selector
   * @returns {object} - the DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns an array of DOM objects that match the given selector.
   * @param {string} query - query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();