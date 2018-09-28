export const likeBadge = (restaurant, container, toggleCallback) => {
  const heart = document.createElement("button");
  heart.type = "button";
  heart.addEventListener("click", () => {
    heart.classList.toggle("favorite");
    toggleCallback(restaurant.id, heart.classList.contains("favorite"));
  });
  heart.classList.add("like");
  if (restaurant.is_favorite) {
    heart.classList.add("favorite");
  }
  heart.innerText = "like";
  container.appendChild(heart);
};
