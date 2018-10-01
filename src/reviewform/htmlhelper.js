const options = `<label for="rating_options">Rating:</label>
    <select name="rating" id="rating_options" required>
      <option value="5">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605; (5 stars)</option>
      <option value="4">&#x2605;&#x2605;&#x2605;&#x2605;&#x2606; (4 stars)</option>
      <option value="3">&#x2605;&#x2605;&#x2605;&#x2606;&#x2606; (3 stars)</option>
      <option value="2">&#x2605;&#x2605;&#x2606;&#x2606;&#x2606; (2 stars)</option>
      <option value="1">&#x2605;&#x2606;&#x2606;&#x2606;&#x2606; (1 star)</option>
      <option value="0">&#x2606;&#x2606;&#x2606;&#x2606;&#x2606; (0 stars)</option>
    </select>`;

export const reviewForm = restaurantId => {
  let template = document.createElement("template");
  template.innerHTML = `<form action="" method="POST">
    <div class="formline">
        <input type="hidden" id="restaurant_id" name="restaurant_id" value="${restaurantId}">
      </div>
    <div class="formline">
      <input type="text" required id="reviewer_name" name="name" minlength="2" placeholder="&nbsp;">
      <label for="reviewer_name">Your name:</label>
    </div>
    <div class="formline no-label-move">
      ${options}
    </div>
    <div class="formline">
      <textarea required name="comments" id="review_comments" minlength="2" rows="5" placeholder="&nbsp;"></textarea>
      <label for="review_comments">Comments:</label>
    </div>
    <div class="formline actions">
      <input type="submit" class="submit" value="Submit" />
    </div>
  </form>`;
  return template.content.firstChild;
};
