import { urlForRestaurant } from "../shared/api/index";
import { createRestaurantImage } from "../shared/utilities/html/htmlhelper";
import { mapMarkerForRestaurant } from "../shared/map/index";

/**
 * Set neighborhoods HTML.
 */
export const fillNeighborhoodsHTML = neighborhoods => {
  const select = document.getElementById("neighborhoods-select");
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement("option");
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Set cuisines HTML.
 */
export const fillCuisinesHTML = cuisines => {
  const select = document.getElementById("cuisines-select");

  cuisines.forEach(cuisine => {
    const option = document.createElement("option");
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

export const fillOptionElementHTML = (options, elementId) => {
  const select = document.getElementById(elementId);
  options.forEach(option => {
    const optionEntry = document.createElement("option");
    optionEntry.innerHTML = option;
    optionEntry.value = option;
    select.append(optionEntry);
  });
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
export const fillRestaurantsHTML = (restaurants = self.restaurants, map) => {
  const ul = document.getElementById("restaurants-list");
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap(restaurants, map);
};

/**
 * Add markers for current restaurants to the map.
 */
export const addMarkersToMap = (restaurants = self.restaurants, map) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = mapMarkerForRestaurant(restaurant, map);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });
};

/**
 * Create restaurant HTML.
 */
export const createRestaurantHTML = restaurant => {
  const li = document.createElement("li");
  const container = document.createElement("div");
  container.className = "restaurant-container";
  container.append(createRestaurantImage(restaurant));
  container.append(createRestaurantInfo(restaurant));
  li.appendChild(container);
  return li;
};

/*
 * Create te restaurant-info part
 */
export const createRestaurantInfo = restaurant => {
  const container = document.createElement("div");
  container.className = "restaurant-info";
  const name = document.createElement("h2");
  name.innerHTML = restaurant.name;
  container.append(name);

  const neighborhood = document.createElement("p");
  neighborhood.innerHTML = restaurant.neighborhood;
  container.append(neighborhood);

  const address = document.createElement("p");
  address.innerHTML = restaurant.address;
  container.append(address);

  const more = document.createElement("a");
  more.innerHTML = "View Details";
  more.href = urlForRestaurant(restaurant);
  more.setAttribute(
    "aria-label",
    `View details for restaurant ${restaurant.name}`
  );
  container.append(more);

  return container;
};

export const resetRestaurants = restaurants => {
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