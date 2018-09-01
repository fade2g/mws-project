import { urlForRestaurant } from "../api/index";

export function mapMarkerForRestaurant(restaurant, map) {
  // https://leafletjs.com/reference-1.3.0.html#marker
  const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng], { // eslint-disable-line no-undef,new-cap
    title: restaurant.name,
    alt: restaurant.name,
    url: urlForRestaurant(restaurant)
  });
  marker.addTo(map);
  return marker;
}
