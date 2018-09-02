import idb from "../../../node_modules/idb";

const DB_NAME = "restrant-reviews";
const RESTAURANT_STORE = "restaurants";

export function openDatabase() {
  // If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }
  return idb.open(DB_NAME, 1, upgradeDb => {
    upgradeDb.createObjectStore(RESTAURANT_STORE, { keyPath: "id" });
  });
}

export function getRestarantById(db, id) {
  let store = db.transaction(RESTAURANT_STORE).objectStore(RESTAURANT_STORE);
  return store.get(id);
}

export function putRestauant(db, restaurant) {
  const tx = db.transaction(RESTAURANT_STORE, "readwrite");
  const store = tx.objectStore(RESTAURANT_STORE);
  store.put(restaurant);
  return tx.complete.then(() => Promise.resolve(restaurant));
}
