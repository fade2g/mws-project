import { staticCacheName } from "./constants";

export const getStaticAsset = function(cacheKey) {
  return caches.open(staticCacheName).then(cache => cache.match(cacheKey));
};
