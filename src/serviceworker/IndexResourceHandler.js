import FetchHandler from "./FetchHandler";
import { indexRegex} from "./constants";
import { getStaticAsset } from "./cache";

/**
 * Implementation for a fetch handler that checks, if the requested resource is the index.html (or "/")
 * and retruns the static index.html
 * Extends @type FetchHandler
 */
export default class IndexResourceHandler extends FetchHandler {

  /**
   * Returns true, if the request is for one of the cached assets
   */
  test() {
    return this.urlFromRequest().pathname.match(indexRegex);
  }

  /**
   * Calls event.respondWith with the "index.html" from the cache
   */
  handle() {
    this.event.respondWith(getStaticAsset("/index.html"));
    return true;
  }
}
