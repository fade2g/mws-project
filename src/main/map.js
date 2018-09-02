/* global L */
import { API_TOKEN } from "../shared/api_token/api_token";

export const initMap = () => {
    try {
      let newMap = L.map("map", {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
      });
      L.tileLayer(
        "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}",
        {
          mapboxToken: API_TOKEN,
          maxZoom: 18,
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: "mapbox.streets"
        }
      ).addTo(newMap);
      return newMap;
    } catch (error) {
      /* eslint-disable no-console */
      console.error("Unable to initialize map", error);
      /* eslint-enable no-console */
    }
}