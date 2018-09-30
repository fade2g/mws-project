import {
  createRestaurantFigure,
  clearChildNodes
} from "../shared/utilities/htmlhelper";

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = operatingHours => {
  const hours = document.getElementById("restaurant-hours");
  clearChildNodes(hours);
  Object.keys(operatingHours).map(key => {
    const row = document.createElement("tr");

    const day = document.createElement("td");
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement("td");
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  });
};

/* ---------EXPORTS--------- */

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
export const fillBreadcrumb = restaurant => {
  const breadcrumb = document.getElementById("breadcrumb");
  clearChildNodes(breadcrumb);
  const rootLi = document.createElement("li");
  rootLi.innerHTML = "<a href='/'>Home</a>";
  breadcrumb.appendChild(rootLi);
  const li = document.createElement("li");
  li.innerHTML = restaurant.name;
  li.setAttribute("aria-current", "page");
  breadcrumb.appendChild(li);
};

/**
 * Create restaurant HTML and add it to the webpage
 */
export const fillRestaurantHTML = restaurant => {
  const name = document.getElementById("restaurant-name");
  name.innerHTML = restaurant.name;

  const address = document.getElementById("restaurant-address");
  address.innerHTML = restaurant.address;

  const imageContainer = document.getElementById("restaurant-img");
  clearChildNodes(imageContainer);
  imageContainer.appendChild(createRestaurantFigure(restaurant));

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML(restaurant.operating_hours);
  }
};
