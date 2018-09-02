import runtime from "serviceworker-webpack-plugin/lib/runtime";

export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    const registration = runtime.register();
    return registration;
  }
};

export const registerServiceWorker_origin = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
  }
};
