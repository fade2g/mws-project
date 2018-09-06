import { DATA_URL } from "../globals";

const restaurantPropertyExtractorFactory = function(relevantProperty) {
  return function restaurantPropertyExtractor() {
    return fetchRestaurants().then(restaurants => restaurants.reduce((accumulator, current) => {
        accumulator.add(current[relevantProperty]);
        return accumulator;
      }, new Set()));
  };
};

const propertyFilterFactory = (filterProperty, criteria) => function(element) {
    return criteria === "all" || element[filterProperty] === criteria;
  };

const handleBackendResponse = response => {
  if (response.ok) {
    if (response.status !== 200) {
      return Promise.reject(new Error("Fetched data not availabe"));
    }
    return response.json();
  }
  throw new Error("Network response was not ok.");
};

/* ---------EXPORTS--------- */

export const fetchRestaurant = id => fetch(`${DATA_URL}/${id}`).then(handleBackendResponse);
export const fetchRestaurants = () => fetch(DATA_URL).then(handleBackendResponse);

export function fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
  return fetchRestaurants().then(restaurants => restaurants
      .filter(propertyFilterFactory("cuisine_type", cuisine))
      .filter(propertyFilterFactory("neighborhood", neighborhood)));
}

export const imageUrlForRestaurant = photographId => `/img/${photographId}.jpg`;
export const urlForRestaurant = restaurant => `./restaurant.html?id=${restaurant.id}`;
export const fetchNeighborhoods = restaurantPropertyExtractorFactory("neighborhood");
export const fetchCuisines = restaurantPropertyExtractorFactory("cuisine_type");
