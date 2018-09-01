import { fillRestaurantsHTML } from "./htmlhelper";
import { fetchRestaurantByCuisineAndNeighborhood } from "../shared/api/index";

const resetRestaurants = restaurants => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById("restaurants-list");
  ul.innerHTML = "";

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Update page and map for current restaurants.
 */
export const updateRestaurants = map => {
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
