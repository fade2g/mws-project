import { fetchRestaurant } from "../shared/api/index";
import { initMap, mapMarkerForRestaurant } from "../shared/map/index";
import {
  getUrlParameterByName,
  registerServiceWorker
} from "../shared/utilities/index";
import { fillBreadcrumb, fillRestaurantHTML } from "./htmlhelper";
import { toggleOnlineState } from "../shared/utilities/htmlhelper";
import { initReviews } from "../reviews";
import { UPDATE_RESTAURANT_MESSAGE_TYPE } from "../shared/globals";
import ServiceWorkerMessageHandler from "../shared/ServiceworkerMessageHandler";
import { initReviewForm } from "../reviewform";

let listener;
let mapboxMap;
const restaurantId = parseInt(getUrlParameterByName("id"), 10);

const init = function() {
  document.removeEventListener("DOMContentLoaded", listener);
  toggleOnlineState();
  window.addEventListener("online", toggleOnlineState);
  window.addEventListener("offline", toggleOnlineState);
  navigator.serviceWorker.onmessage = new ServiceWorkerMessageHandler()
    .withMessageType(UPDATE_RESTAURANT_MESSAGE_TYPE)
    .withSkipEmpty(true)
    .withHandler(restaurant => {
      mapboxMap = initMap(restaurant);
      if (restaurant) {
        mapMarkerForRestaurant(restaurant, mapboxMap);
        fillBreadcrumb(restaurant);
        fillRestaurantHTML(restaurant);
      }
    })
    .listener();

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
  initReviews(restaurantId, document.getElementById("reviews-container"));
  initReviewForm(restaurantId, document.getElementById("review-form-container"));
};

listener = document.addEventListener("DOMContentLoaded", init);
