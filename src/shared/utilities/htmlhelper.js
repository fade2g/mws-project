import { imageUrlForRestaurant } from "../api/index";
import { likeBadge } from "../like/like";
import { favoriteRestaurant } from "../api/index";

/*
 * Create the source element for a picture element
 * It will include a media-query for the min-width (include the unit) and append a suffix to the filename
 */
const createRestaurantPictureSource = (restaurant, minWidth, suffix) => {
  const source = document.createElement("source");
  source.setAttribute("media", `(min-width: ${minWidth})`);
  source.setAttribute(
    "srcset",
    restaurant.replace(/(\.[\w\d_-]+)$/iu, `-${suffix}$1`)
  );
  return source;
};

export const createRestaurantFigure = restaurant => {
  const picture = createRestaurantImage(restaurant);
  const figcaption = document.createElement("figcaption");
  figcaption.innerText = restaurant.cuisine_type;
  const figure = document.createElement("figure");
  figure.appendChild(picture);
  figure.appendChild(figcaption);
  return figure;
};

/*
   * Create the restaurant-picture part with picture element with multiple media queries
   * and the image element containing the alt text for the image
   */
export const createRestaurantImage = restaurant => {
  const restaurantImage = imageUrlForRestaurant(restaurant.photograph);
  const picture = document.createElement("picture");
  picture.className = "restaurant-picture";
  picture.appendChild(createRestaurantPictureSource(restaurantImage, "901px", "800"));
  picture.appendChild(createRestaurantPictureSource(restaurantImage, "300px", "400"));

  const image = document.createElement("img");
  image.className = "restaurant-img";
  image.src = restaurantImage.replace(/(\.[\w\d_-]+)$/iu, "-400$1");
  image.alt = `Impression of the restaurant '${restaurant.name}'`;
  picture.append(image);
  likeBadge(restaurant, picture, favoriteRestaurant);
  return picture;
};

export const clearChildNodes = node => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};
