import FetchHandler from "./FetchHandler";
import { staticCacheName } from "./constants";
import { getStaticAsset } from "./cache";

/**
 * Implementation for a fetch handler that checks, if the requested resource is one of the cached assets
 * and retruns the assets from the cache instead of the network.
 * Extends @type FetchHandler
 */
export default class AppResourcesHandler extends FetchHandler {

  /**
   * Returns true, if the request is for one of the cached assets
   */
  test() {
    return this.options.serviceWorkerOption.assets.includes(this.urlFromRequest().pathname);
  }

  /**
   * Calls event.respondWith with the requested resource from the cache
   */
  handle() {
    let url = this.urlFromRequest();
    caches.open(staticCacheName).then(cache => {
      cache.match(url.pathname).then(cached => Promise.resolve(cached));
    });
    this.event.respondWith(getStaticAsset(url.pathname));
    return true;
  }
}
