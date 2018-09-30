import { reviewForm } from "./htmlhelper";
import { postReview } from "../shared/api";

let myRestaurantId;
let myReviewFormContainer;

/**
 * This function creates the reviewForm and handles the related events. Not that displaying and hoding the form is not part of this module.
 * @param {Integer} restaurantId ID of the restaurant, for which the reviews shall be filled
 * @param {Node} parentNode Node, under which the reviews shall be added
 */
export const initReviewForm = (restaurantId, reviewFormContainer) => {
  myRestaurantId = restaurantId;
  myReviewFormContainer = reviewFormContainer;
  const createdNode = reviewForm(myRestaurantId);
  createdNode.addEventListener("submit", event => {
    postReview({
      restaurant_id: 1,
      name: "jgdklgjdfl",
      rating: 5,
      comments: "ffff"
    });
    event.preventDefault();
  });
  myReviewFormContainer.appendChild(createdNode);
};
