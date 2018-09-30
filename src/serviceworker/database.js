import idb from "idb";

const DB_NAME = "restaurant-reviews";
const RESTAURANT_STORE = "restaurants";
const REVIEWS_STORE = "reviews";
export const QUEUE_NAME = "restaurant-queue";

/**
 * Opens the IndexDB
 * @returns {Promise} Promise that resolves to an open IndexDB
 */
export function openDatabase(dbName = DB_NAME) {
  return idb.open(dbName, 3, upgradeDb => {
    /* eslint-disable no-fallthrough */
    switch (upgradeDb.oldVersion) {
      case 0:
        upgradeDb.createObjectStore(RESTAURANT_STORE, { keyPath: "id" });
      case 1:
        upgradeDb.createObjectStore(QUEUE_NAME, {
          keyPath: "__generatedKey",
          autoIncrement: true
        });
      case 2:
        const reviewsStore = upgradeDb.createObjectStore(REVIEWS_STORE, {keyPath: "id"}); // eslint-disable-line no-case-declarations
        reviewsStore.createIndex("restaurant", "restaurant_id");
      default:
    }
    /* eslint-ensable no-fallthrough */
  });
}

/**
 * Stores the item in the given object tore and returns it
 * @param {indexDb} db Open indexDb
 * @param {String} storeName name of the object store
 * @param {Object} item Object to be stored
 */
export function storeItem(db, storeName, item) {
  const tx = db.transaction(storeName, "readwrite");
  tx.objectStore(storeName).put(item);
  return tx.complete.then(() => Promise.resolve(item));
}

export function itemCursor(db, storeName) {
  const tx = db.transaction(storeName, "readwrite");
  return tx.objectStore(storeName).openCursor();
}

export function deleteItem(db, storeName, itemKey) {
  const tx = db.transaction(storeName, "readwrite");
  return tx.objectStore(storeName).delete(itemKey);
}

/**
 * Returns a single restaurant obect from the database
 * @param {IndexDB} db Open IndexDB
 * @param {int} id ID of the restaurant to be retrieved
 * @returns {Promise} Promise that resolved to the single restaurant.
 */
export function getRestaurantById(db, id) {
  return db
    .transaction(RESTAURANT_STORE)
    .objectStore(RESTAURANT_STORE)
    .get(id);
}

/**
 * This method returns all resurants from the database
 * @param {indexDb} db Open indexdb
 * @returns {Promise} Promise that resolves to a list of all restaurants stored in indexdb
 */
export function getRestaurants(db) {
  return db
    .transaction(RESTAURANT_STORE)
    .objectStore(RESTAURANT_STORE)
    .getAll();
}

export function storeCollectionItem(db, storeName, item) {
  const tx = db.transaction(storeName, "readwrite");
  tx.objectStore(storeName).put(item);
  return tx.complete.then(() => Promise.resolve(item));
}

export function storeCollection(db, storeName, collection) {
  if (Array.isArray(collection)) {
    return Promise.all(collection.map(item => storeCollectionItem(db, storeName, item)));
  }
  return Promise.resolve(collection);
}

export function storeReviews(db, reviews) {
  return storeCollection(db, REVIEWS_STORE, reviews);
}

export function getRestaurantReviews(db, restaurantId) {
  return db
    .transaction(REVIEWS_STORE)
    .objectStore(REVIEWS_STORE)
    .index("restaurant")
    .getAll(restaurantId);
}

/**
 * This method stores a restaurant in the database
 * @param {indexDb} db Open indexDb
 * @param {Object} restaurant Resturant object to be stored in the database
 * @returns {Promise} Promise that resolves to the restaurant object provided once the restaurant is stored
 */
export function putRestaurant(db, restaurant) {
  const tx = db.transaction(RESTAURANT_STORE, "readwrite");
  tx.objectStore(RESTAURANT_STORE).put(restaurant);
  return tx.complete.then(() => Promise.resolve(restaurant));
}

/**
 * This method stores an array of restaurants in the database
 * @param {indexDb} db Open indexDb
 * @param {Array<Obect>} restaurants Array with restaurant objects to be srored in the databas
 * @returns {Array<Object>} Promise that resolves to the provided restaurant array once all restuarants are stored
 */
export function putRestaurants(db, restaurants) {
  if (Array.isArray(restaurants)) {
    return Promise.all(restaurants.map(restaurant => putRestaurant(db, restaurant)));
  }
  return Promise.resolve(restaurants);
}

/**
 * This function updates the given retsaurant's is_favorite flag
 * @param {indexDb} db Open indexDb
 * @param {Integer} id ID of the restaurant
 * @param {boolean} like value that will be set for is_favorite
 */
export function likeRestaurant(db, id, like) {
  const transaction = db.transaction(RESTAURANT_STORE, "readwrite");
  const objectStore = transaction.objectStore(RESTAURANT_STORE);
  objectStore.get(id).then(restaurant => {
    restaurant.is_favorite = like;
    objectStore.put(restaurant);
    return transaction.complete;
  });
}
