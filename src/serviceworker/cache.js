import {
  cachePrefix,
  staticCacheName,
  imageCacheName,
  transientCacheName
} from "./constants";

export const getStaticAsset = function(cacheKey) {
  return caches.open(staticCacheName).then(cache => cache.match(cacheKey));
};

export const isCurrentCache = cacheName => cacheName === staticCacheName ||
  cacheName === imageCacheName ||
  cacheName === transientCacheName;

export const isOwnCache = cacheName => cacheName.startsWith(cachePrefix);

export const cacheAssets = (assets) => caches
.open(staticCacheName)
.then(cache => cache.addAll(assets))