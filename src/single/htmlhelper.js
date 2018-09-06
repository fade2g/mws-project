import {
  createRestaurantFigure,
  clearChildNodes
} from "../shared/utilities/html/htmlhelper";

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = operatingHours => {
  const hours = document.getElementById("restaurant-hours");
  clearChildNodes(hours);
  Object.keys(operatingHours).map(key => {
    const row = document.createElement("tr");

    const day = document.createElement("td");
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement("td");
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  });
};

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = review => {
  const li = document.createElement("li");
  const name = document.createElement("p");
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement("p");
  date.innerHTML = review.date;
  li.appendChild(date);

  const ratingStars =
    "\u2605\u2605\u2605\u2605\u2605\u2606\u2606\u2606\u2606\u2606";

  const rating = document.createElement("p");
  const starSpan = document.createElement("span");
  starSpan.innerHTML = ratingStars.substr(5 - review.rating, 5);
  starSpan.setAttribute("aria-valuetext", review.rating);
  rating.innerHTML = "Rating: ";
  rating.appendChild(starSpan);
  li.appendChild(rating);

  const comments = document.createElement("p");
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = reviews => {
  const reviewsContainer = document.getElementById("reviews-container");
  if (!reviews) {
    const noReviews = document.createElement("p");
    noReviews.innerHTML = "No reviews yet!";
    reviewsContainer.appendChild(noReviews);
    return;
  }
  const reviewsList = document.getElementById("reviews-list");
  clearChildNodes(reviewsList);
  reviews.forEach(review => {
    reviewsList.appendChild(createReviewHTML(review));
  });
  // reviewsContainer.appendChild(reviewsList);
};

/* ---------EXPORTS--------- */

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
export const fillBreadcrumb = restaurant => {
  const breadcrumb = document.getElementById("breadcrumb");
  clearChildNodes(breadcrumb);
  const rootLi = document.createElement("li");
  rootLi.innerHTML = "<a href='/'>Home</a>";
  breadcrumb.appendChild(rootLi);
  const li = document.createElement("li");
  li.innerHTML = restaurant.name;
  li.setAttribute("aria-current", "page");
  breadcrumb.appendChild(li);
};

/**
 * Create restaurant HTML and add it to the webpage
 */
export const fillRestaurantHTML = restaurant => {
  const name = document.getElementById("restaurant-name");
  name.innerHTML = restaurant.name;

  const address = document.getElementById("restaurant-address");
  address.innerHTML = restaurant.address;

  const imageContainer = document.getElementById("restaurant-img");
  clearChildNodes(imageContainer);
  imageContainer.appendChild(createRestaurantFigure(restaurant));

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML(restaurant.operating_hours);
  }
  // fill reviews
  fillReviewsHTML(restaurant.reviews);
};
