import { reviewForm } from "./htmlhelper";
import { postReview } from "../shared/api";
import DOMPurify from "dompurify";

/**
 * This function creates the reviewForm and handles the related events. Not that displaying and hoding the form is not part of this module.
 * @param {Integer} restaurantId ID of the restaurant, for which the reviews shall be filled
 * @param {Node} parentNode Node, under which the reviews shall be added
 */

export default class ReviewForm {
  constructor(restaurantId, reviewFormContainer, reviewFormToggle) {
    this.restaurantId = restaurantId;
    this.reviewFormContainer = reviewFormContainer;
    this.reviewFormToggle = reviewFormToggle;;
  }

  initForm() {
    this.createdNode = reviewForm(this.restaurantId);
    this.createdNode.addEventListener("submit", event => {
      postReview({
        restaurant_id: parseInt(DOMPurify.sanitize(event.target.querySelector("#restaurant_id").value), 10),
        name: DOMPurify.sanitize(event.target.querySelector("#reviewer_name").value),
        rating: DOMPurify.sanitize(event.target.querySelector("#rating_options").value),
        comments: DOMPurify.sanitize(event.target.querySelector("#review_comments").value)
      }).then(response => {
        console.log(response);
      });
      event.preventDefault();
      this.reviewFormContainer.classList.remove("form-visible");
      this.createdNode.reset();
    });
    this.reviewFormContainer.appendChild(this.createdNode);

    this.reviewFormToggle.addEventListener("click", () => {
        this.reviewFormContainer.classList.toggle("form-visible");
    })
  }
}
