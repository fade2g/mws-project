export const likeBadge = (restaurant, container, toggleCallback) => {
  const heart = document.createElement("button");
  heart.type = "button";
  heart.innerText = `like ${restaurant.name}`;
  heart.classList.add("like");
  if (restaurant.is_favorite === "true" || restaurant.is_favorite === true) {
    heart.classList.add("favorite");
  }
  heart.addEventListener("click", () => {
    heart.classList.toggle("favorite");
    toggleCallback(restaurant.id, heart.classList.contains("favorite"));
  });
  container.appendChild(heart);
};
