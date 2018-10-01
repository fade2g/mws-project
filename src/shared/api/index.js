import { DATA_URL, REVIEWS_URL } from "../globals";

/**
 * Function to only let the objects remain, if the given property is the criterai
 * @param {String} filterProperty Name of the property, on which the filter shall be applied
 * @param {String=} criteria Criteria to be fulfilled. Is undefined, "all" is the default value
 */
const propertyFilterFactory = (filterProperty, criteria = "all") => function(element) {
    return criteria === "all" || element[filterProperty] === criteria;
  };

/**
 * Filters the restaurant to only return those mathing the cuisine and neightborhood
 * @param {Object[]=} restaurants List of restaurants
 * @param {String=} cuisine Cuisine to be filtered for
 * @param {String=} neighborhood Nightborhood to be filtered for
 */
const filterRestaurants = (restaurants = [], cuisine, neighborhood) => restaurants
    .filter(propertyFilterFactory("cuisine_type", cuisine))
    .filter(propertyFilterFactory("neighborhood", neighborhood));

const restaurantPropertyExtractorFactory = function(relevantProperty) {
  return function restaurantPropertyExtractor() {
    return fetch(`${DATA_URL}?meta=true`)
      .then(handleBackendResponse)
      .then(restaurants => Promise.resolve(restaurants))
      .then(restaurants => restaurants.reduce((accumulator, current) => {
          accumulator.add(current[relevantProperty]);
          return accumulator;
        }, new Set()));
  };
};

const handleBackendResponse = response => {
  if (response.ok) {
    if (
      response.status !== 200 &&
      response.status !== 201 &&
      response.status !== 202
    ) {
      return Promise.reject(new Error("Fetched data not availabe"));
    }
    return response.json();
  }
  throw new Error("Network response was not ok.");
};

/* ---------EXPORTS--------- */

export const fetchRestaurant = id => fetch(`${DATA_URL}?id=${id}`).then(handleBackendResponse);
export const fetchRestaurants = (cuisine, neighborhood) => fetch(DATA_URL)
    .then(handleBackendResponse)
    .then(allRestaurants => Promise.resolve(filterRestaurants(allRestaurants, cuisine, neighborhood)));
export const imageUrlForRestaurant = photographId => `/img/restaurants/${photographId}.jpg`;
export const urlForRestaurant = restaurant => `./restaurant.html?id=${restaurant.id}`;
export const fetchNeighborhoods = restaurantPropertyExtractorFactory("neighborhood");
export const fetchCuisines = restaurantPropertyExtractorFactory("cuisine_type");
export const likeRestaurant = (id, favorite) => {
  fetch(`${DATA_URL}${id}/?is_favorite=${favorite}`, { method: "PUT" });
};
export const fetchReviews = id => fetch(`${REVIEWS_URL}?restaurant_id=${id}`).then(handleBackendResponse);

export const postReview = payload => fetch(`${REVIEWS_URL}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  }).then(handleBackendResponse);
