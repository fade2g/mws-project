import { fillRestaurantsHTML, resetRestaurants } from "./htmlhelper";
import { fetchRestaurantByCuisineAndNeighborhood } from "../shared/api/index";

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
