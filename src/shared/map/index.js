/* global L */
import { urlForRestaurant } from "../api/index";
import { API_TOKEN } from "./api_token";

const createMap = (lat = 40.722216, lng = -73.987501) => L.map("map", {
    center: [lat, lng],
    zoom: 12,
    scrollWheelZoom: false
  });

export function initMap(restaurant) {
  try {
    let newMap;
    if (restaurant) {
      newMap = createMap(restaurant.latlng.lat, restaurant.latlng.lng);
    } else {
      newMap = createMap();
    }
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

export function mapMarkerForRestaurant(restaurant, map) {
  // https://leafletjs.com/reference-1.3.0.html#marker
  const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng], { // eslint-disable-line new-cap
    // eslint-disable-line no-undef,new-cap
    title: restaurant.name,
    alt: restaurant.name,
    url: urlForRestaurant(restaurant)
  });
  marker.addTo(map);
  return marker;
}
