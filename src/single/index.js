import { fetchRestaurant } from "../shared/api/index";
import { initMap, mapMarkerForRestaurant } from "../shared/map/index";
import {
  getUrlParameterByName,
  registerServiceWorker
} from "../shared/utilities/index";
import { fillBreadcrumb, fillRestaurantHTML } from "./htmlhelper";
import {toggleOnlineState} from "../shared/utilities/htmlhelper";

let listener;
let mapboxMap;
const restaurantId = parseInt(getUrlParameterByName("id"), 10);

const init = function() {
  document.removeEventListener("DOMContentLoaded", listener);
  toggleOnlineState();
  window.addEventListener("online", toggleOnlineState)
  window.addEventListener("offline", toggleOnlineState)
  registerServiceWorker();
  navigator.serviceWorker.onmessage = function(event) {
    const restaurant = JSON.parse(event.data).payload;
    mapboxMap = initMap(restaurant);
    if (restaurant) {
      mapMarkerForRestaurant(restaurant, mapboxMap);
      fillBreadcrumb(restaurant);
      fillRestaurantHTML(restaurant);
    }
  };

  fetchRestaurant(restaurantId)
    .then(restaurant => {
      mapboxMap = initMap(restaurant);
      mapMarkerForRestaurant(restaurant, mapboxMap);
      fillBreadcrumb(restaurant);
      fillRestaurantHTML(restaurant);
    })
    .catch(() => {
      /* eslint-disable no-console */
      console.log("nothing bad ever happenes");
      /* eslint-enable no-console */
    });
};

listener = document.addEventListener("DOMContentLoaded", init);
