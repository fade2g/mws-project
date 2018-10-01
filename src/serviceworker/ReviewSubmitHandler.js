import FetchHandler from "./FetchHandler";
import { reviewSubmitUrlRegex } from "./constants";
import {
  enqueue,
  processQueue,
  enqueueRequest,
  fetchOrEnqueueRequest
} from "./queue";

/**
 * Implementation for a fetch handler that checks, if the requested resource is one of the cached assets
 * and retruns the assets from the cache instead of the network.
 * Extends @type FetchHandler
 */
export default class ReviewSubmitHandler extends FetchHandler {

  /**
   * Returns true, if the request is for one of the cached assets
   */
  test() {
    return (
      this.getRequest().method === "POST" &&
      this.urlFromRequest().href.match(reviewSubmitUrlRegex)
    );
  }

  /**
   * Calls event.respondWith with the requested resource from the cache
   */
  handle() {
    // TODO
    // Push on local DB? But the ID is missing. Maybe another store?
    const cloned = this.event.request.clone();
    // this.event.respondWith(fetch(cloned));
    console.log(`original reuqest ${this.event.request}`);
    console.log(`will post reuqest ${cloned}`, cloned);
    // fetchOrEnqueueRequest(cloned);
    this.event.respondWith(fetchOrEnqueueRequest(cloned));
    // processQueue();
    return true;
  }
}
