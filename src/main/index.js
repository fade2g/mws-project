import { initMap } from "./map";
import { updateRestaurants } from "./restaurants";
import { fetchNeighborhoods, fetchCuisines } from "../shared/api/index";
import { fillOptionElementHTML } from "./htmlhelper";
import { registerServiceWorker } from "../shared/utilities/serviceworker/index";
import { styles } from "../shared/styles/index"; // eslint-disable-line no-unused-vars

const NEIGHBORHOOD_OPTIONS_SELECTOR = "neighborhoods-select";
const CUISINES_OPTIONS_SELECTOR = "cuisines-select";
let listener;
let newMap;

const init = function() {
  document.removeEventListener("DOMContentLoaded", listener);
  registerServiceWorker();
  newMap = initMap(); // added
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

const attachEventListeners = elementIds => {
  elementIds.map(elementId => {
    document.getElementById(elementId).addEventListener("change", () => {
      updateRestaurants(newMap);
    });
  });
};

listener = document.addEventListener("DOMContentLoaded", init);
