import runtime from "serviceworker-webpack-plugin/lib/runtime";

/**
 * Get a query parameter by name from page URL.
 * @param {String} name Name of the query parameter
 * @param {String} url Url from which the parameter schall be extracted
 * @returns {String} Value of the parameter
 */
export const getUrlParameterByName = (name, url) => {
  let effectiveUrl = url || window.location.href;
  let effectiveName = name.replace(/[[\]]/gu, "\\$&");
  const regex = new RegExp(`[?&]${effectiveName}(=([^&#]*)|&|#|$)`, "u"),
    results = regex.exec(effectiveUrl);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }
  return decodeURIComponent(results[2].replace(/\+/gu, " "));
};

/**
 * Register servcie worker. Uses runtime from serviceworker webpack plugin
 */
export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    const registration = runtime.register();
    return registration;
  }
};
