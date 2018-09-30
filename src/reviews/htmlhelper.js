import { clearChildNodes, formatDate } from "../shared/utilities/htmlhelper";

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = review => {
  const li = document.createElement("li");
  const name = document.createElement("p");
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement("p");
  const createdDate = `${formatDate(new Date(review.createdAt))}`;
  let updatedDate;
  if (review.updatedAt && review.updatedAt !== review.createdAt) {
    updatedDate = `, edited ${formatDate(new Date(review.createdAt))}`
  }
  date.innerHTML = `${createdDate}${updatedDate}`;
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
export const fillReviewsHTML = (reviewsContainer, reviews) => {
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
