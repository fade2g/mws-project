/*
 * Create the source element for a picture element
 * It will include a media-query for the min-width (include the unit) and append a suffix to the filename
 */
const _createRestaurantPictureSource = (restaurant, minWidth, suffix) => {
  const source = document.createElement('source');
  source.setAttribute('media', '(min-width: '+minWidth+' )');
  source.setAttribute('srcset', restaurant.replace(/(\.[\w\d_-]+)$/i, '-'+suffix+'$1'));
  return source;
}

/*
 * Create the restaurant-picture part with picture element with multiple media queries
 * and the image element containing the alt text for the image
 */
const _createRestaurantImage = restaurant => {
  const restaurantImage = DBHelper.imageUrlForRestaurant(restaurant);
  const picture = document.createElement("picture");
  picture.className = "restaurant-picture";
  picture.appendChild(
    _createRestaurantPictureSource(restaurantImage, "300px", "400")
  );
  picture.appendChild(
    _createRestaurantPictureSource(restaurantImage, "400px", "800")
  );

  const image = document.createElement("img");
  image.className = "restaurant-img";
  image.src = restaurantImage.replace(/(\.[\w\d_-]+)$/i, "-400$1");
  image.alt = "Impression of the restaurant '" + restaurant.name + "'";
  picture.append(image);
  return picture;
};

var UTILITIES = {
  createRestaurantImage: _createRestaurantImage
};
