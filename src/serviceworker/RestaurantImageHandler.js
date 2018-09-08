import FetchHandler from "./FetchHandler";
import { imageCacheName } from "./constants";
import { getStaticAsset } from "./cache";

const restaurantImageUrlRegex = /\/img\/restaurants\/.+-\d+(\.jpe?g|png|gif|svg$)/iu;
const restaurantImageSuffixRefex = /-\d+\.jpe?g|png|gif|svg$/iu;

function getImageFromCacheOrNetwork(request, cacheUrl) {
  return caches.open(imageCacheName).then(cache => cache.match(cacheUrl).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request)
        .then(fetchResponse => {
          if (fetchResponse.ok) {
            cache.put(cacheUrl, fetchResponse.clone());
            return fetchResponse;
          }
          return getStaticAsset("assets/no_image.svg");
        })
        .catch(() => getStaticAsset("assets/no_image.svg"));
    }));
}

/**
 * Implementation for a fetch handler that retrieves the restaurant image from the cache (if available, without respect to trequired resolution)
 * or retrieves it from the network, possibly returning a fallback asset
 * Extends @type FetchHandler
 */
export default class RestaurantImageHandler extends FetchHandler {

  /**
   * Returns true, if the request is for a restaurant image
   */
  test() {
    return this.urlFromRequest().href.match(restaurantImageUrlRegex);
  }

  /**
   * Calls event.respondWith with the "restaurant.html" from the cache. Query parameters are removed
   */
  handle() {
    const cacheUrl = this.event.request.url.replace(
      restaurantImageSuffixRefex,
      ""
    );
    this.event.respondWith(getImageFromCacheOrNetwork(this.event.request, cacheUrl));
    return true;
  }
}
