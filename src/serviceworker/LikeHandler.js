import FetchHandler from "./FetchHandler";
import { likeRestaurantUrlRegex } from "./constants";
import { openDatabase, likeRestaurant } from "./database";

/**
 * Implementation for a fetch handler that checks, if the requested resource is one of the cached assets
 * and retruns the assets from the cache instead of the network.
 * Extends @type FetchHandler
 */
export default class LikeHandler extends FetchHandler {

  /**
   * Returns true, if the request is for one of the cached assets
   */
  test() {
    return (
      this.getRequest().method === "PUT" &&
      this.urlFromRequest().href.match(likeRestaurantUrlRegex)
    );
  }

  /**
   * Calls event.respondWith with the requested resource from the cache
   */
  handle() {
    // path local indexDbb restaurant information and then trigger the post request or put it in a queue
    const id = parseInt(
      likeRestaurantUrlRegex.exec(this.urlFromRequest().href)[1],
      10
    );
    const favorite = this.urlFromRequest().searchParams.get("is_favorite");
    openDatabase()
      .then(db => likeRestaurant(db, id, favorite))
      .then(result => {
        this.log("this is the reuslt", result);
      });
    fetch(this.event.request)
    .catch(error => {
      this.log('Failed executing', error)
    });
    return true;
  }
}
