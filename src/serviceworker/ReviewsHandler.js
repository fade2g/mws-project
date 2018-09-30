import FetchHandler from "./FetchHandler";
import { reviewsUrlRegex, badRequestResponse } from "./constants";
import { storeReviews, openDatabase, getRestaurantReviews } from "./database";
import { UPDATE_REVIEWS_MESSAGE_TYPE } from "../shared/globals";

export default class ReviewsHandler extends FetchHandler {

  /**
   * Returns true, if the request is for one of the cached assets
   */
  test() {
    return this.urlFromRequest().href.match(reviewsUrlRegex);
  }

  handle() {
    let restaurantId = parseInt(
      this.urlFromRequest().searchParams.get("restaurant_id"),
      10
    );
    if (!restaurantId) {
      this.log("jkdshkdhfkhdskfjhdskjhfkjdhfkdjsh");
      this.event.respondWith(badRequestResponse);
      return;
    }
    this.event.respondWith(openDatabase()
        .then(db => getRestaurantReviews(db, restaurantId))
        .then((reviews = []) => {
          const response = new Response(JSON.stringify(reviews), {status: 200});
          return Promise.resolve(response);
        }));

    this.event.waitUntil(fetch(this.event.request)
        .then(response => response.json())
        .then(reviews => openDatabase().then(db => storeReviews(db, reviews)))
        .then(reviews => this.options.notify(UPDATE_REVIEWS_MESSAGE_TYPE, reviews)));
    return true;
  }
}
