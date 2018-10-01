import { fetchReviews } from "../shared/api";
import { UPDATE_REVIEWS_MESSAGE_TYPE} from "../shared/globals";
import ServiceWorkerMessageHandler from "../shared/ServiceworkerMessageHandler";
import { fillReviewsHTML, addReviewHTML } from "./htmlhelper";

/**
 * This function fetches the reviews and for a given restaurant by building the required HTML
 * @param {Integer} restaurantId ID of the restaurant, for which the reviews shall be filled
 * @param {Node} parentNode Node, under which the reviews shall be added
 */
export const initReviews = (restaurantId, reviewsContainter) => {
  fetchReviews(restaurantId).then(reviews => {
    fillReviewsHTML(reviewsContainter, reviews)
  });
  navigator.serviceWorker.onmessage = new ServiceWorkerMessageHandler()
    .withMessageType(UPDATE_REVIEWS_MESSAGE_TYPE)
    .withSkipEmpty(false)
    .withHandler(reviews => {
      fillReviewsHTML(reviewsContainter, reviews);
    })
    .listener();
};

export const addReview = (review) => {
  addReviewHTML(review)
}