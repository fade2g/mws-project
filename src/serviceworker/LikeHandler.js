import FetchHandler from "./FetchHandler";
import { likeRestaurantUrlRegex } from "./constants";
import { openDatabase, likeRestaurant } from "./database";
import { enqueue, processQueue } from "./queue";

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
    const cloned = this.event.request.clone();
    const headers = {}
    for (let pair of cloned.headers.entries()) {
      headers[pair[0]] = pair[1];
   }
    const serializable = {
      url: cloned.url,
      headers,
      method: cloned.method,
      body: cloned.body,
      mode: cloned.mode
    };
    enqueue(serializable);
    processQueue();
    return true;
  }
}
