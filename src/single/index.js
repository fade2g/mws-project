import { initMap } from "./map";
import { fillBreadcrumb, fillRestaurantHTML } from "./htmlhelper";
import { fetchRestaurant } from "../shared/api/index";
import { mapMarkerForRestaurant } from "../shared/map/index";
import { getUrlParameterByName } from "../shared/utilities/index";
import { registerServiceWorker } from "../shared/utilities/serviceworker/index";
import { styles } from "../shared/styles/index"; // eslint-disable-line no-unused-vars

let listener;
let newMap;
const restaurantId = parseInt(getUrlParameterByName("id"), 10);

const init = function() {
  document.removeEventListener("DOMContentLoaded", listener);
  registerServiceWorker();
  fetchRestaurant(restaurantId).then(restaurant => {
    this.restaurant = restaurant;
    newMap = initMap(restaurant);
    mapMarkerForRestaurant(restaurant, newMap);
    fillBreadcrumb(restaurant);
    fillRestaurantHTML(restaurant);
  });
};

listener = document.addEventListener("DOMContentLoaded", init);
