import { DATA_URL, APP_VERSION } from "../shared/globals";

export const badRequestResponse = new Response(null, {
  status: 400,
  statusText: "Bad request"
});

export const notCachedResponse = new Response(null, {
  status: 202,
  statusText: "Data is not available in cache"
});

export const indexRegex = /^\/(index\.html)?$/gmu;
export const restaurantRegex = /restaurant\.html\?id=[0-9a-zA-Z]*$/gu;
export const imageRegex = /img\/.*\.(jpe?g|png|gif|svg)$/iu;
export const restaurantsDataUrlRegex = new RegExp(`^${DATA_URL}?.*$`, "iu");
export const restaurantDataUrlRegex = new RegExp(
  `^${DATA_URL}/([0-9]+)$`,
  "iu"
);
export const cachePrefix = "rr***-";
export const staticCacheName = `${cachePrefix}static-${APP_VERSION}`;
export const imageCacheName = `${cachePrefix}imgs-${APP_VERSION}`;
export const transientCacheName = `${cachePrefix}transient-${APP_VERSION}`;
