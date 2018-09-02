/**
 * Get a parameter by name from page URL.
 */
export const getUrlParameterByName = (name, url) => {
    let effectiveUrl = url || window.location.href;
    let effectiveName = name.replace(/[[\]]/gu, "\\$&");
    const regex = new RegExp(`[?&]${effectiveName}(=([^&#]*)|&|#|$)`, 'u'),
      results = regex.exec(effectiveUrl);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return "";
    }
    return decodeURIComponent(results[2].replace(/\+/gu, " "));
  };