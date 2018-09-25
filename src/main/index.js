/**
 * This module is the core module for the main page with all restaurants
 */
import { updateRestaurants } from "./restaurants";
import { fetchNeighborhoods, fetchCuisines } from "../shared/api/index";
import {
  fillOptionElementHTML,
  fillRestaurantsHTML,
  resetRestaurants
} from "./htmlhelper";
import { registerServiceWorker } from "../shared/utilities/index";
import { initMap } from "../shared/map/index";

const NEIGHBORHOOD_OPTIONS_SELECTOR = "neighborhoods-select";
const CUISINES_OPTIONS_SELECTOR = "cuisines-select";
let listener;
let mapboxMap;

const init = function() {
  document.removeEventListener("DOMContentLoaded", listener);
  registerServiceWorker();

  mapboxMap = initMap();
  updateRestaurants(mapboxMap);

  navigator.serviceWorker.onmessage = function(event) {
    const restaurants = JSON.parse(event.data).payload;
    if (restaurants) {
      resetRestaurants(restaurants, mapboxMap);
      fillRestaurantsHTML(restaurants, mapboxMap);
    }
  };

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
  const handler = function() {
    updateRestaurants(mapboxMap);
  };
  elementIds.map(elementId => {
    document.getElementById(elementId).addEventListener("change", handler);
  });
};

listener = document.addEventListener("DOMContentLoaded", init);
