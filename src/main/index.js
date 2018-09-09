/**
 * This module is the core module for the main page with all restaurants
 */
import { fetchNeighborhoods, fetchCuisines } from "../shared/api/index";
import {
  fillOptionElementHTML,
  fillRestaurantsHTML,
  resetRestaurants
} from "./htmlhelper";
import { registerServiceWorker } from "../shared/utilities/index";
import { initMap } from "../shared/map/index";
import { fetchRestaurantByCuisineAndNeighborhood } from "../shared/api/index";

const NEIGHBORHOOD_OPTIONS_SELECTOR = "neighborhoods-select";
const CUISINES_OPTIONS_SELECTOR = "cuisines-select";
let listener;
let newMap;

const updateRestaurants = map => {
  const cSelect = document.getElementById("cuisines-select");
  const nSelect = document.getElementById("neighborhoods-select");

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood).then(restaurants => {
      resetRestaurants(restaurants, map);
      fillRestaurantsHTML(restaurants, map);
    });
};

const init = function() {
  document.removeEventListener("DOMContentLoaded", listener);
  registerServiceWorker();
  navigator.serviceWorker.onmessage = function(event) {
    const restaurants = JSON.parse(event.data).payload;
    if (restaurants) {
      resetRestaurants(restaurants, newMap);
      fillRestaurantsHTML(restaurants, newMap);
    }
  };
  newMap = initMap();
  updateRestaurants(newMap);

  fetchNeighborhoods().then(neighborhoods => {
    this.neighborhoods = neighborhoods;
    fillOptionElementHTML(neighborhoods, NEIGHBORHOOD_OPTIONS_SELECTOR);
  });
  fetchCuisines().then(cuisines => {
    this.cuisines = cuisines;
    fillOptionElementHTML(cuisines, CUISINES_OPTIONS_SELECTOR);
  });
  attachEventListeners([
    NEIGHBORHOOD_OPTIONS_SELECTOR,
    CUISINES_OPTIONS_SELECTOR
  ]);
};

/**
 * Function to attach listeners to `change` events. Osed for the select elements
 * @param {Array<String>} elementIds Array with ID of HTML elements
 */
const attachEventListeners = elementIds => {
  elementIds.map(elementId => {
    document.getElementById(elementId).addEventListener("change", () => {
      updateRestaurants(newMap);
    });
  });
};

listener = document.addEventListener("DOMContentLoaded", init);
