import {
  openDatabase,
  storeItem,
  deleteItem,
  itemCursor,
  QUEUE_NAME
} from "./database";

const serializeRequest = request => {
  const cloned = request.clone();
  const headers = {};
  for (let pair of cloned.headers.entries()) {
    headers[pair[0]] = pair[1];
  }
  const serializable = {
    url: cloned.url,
    headers,
    method: cloned.method,
    body: cloned.body,
    mode: cloned.mode
  };
  return serializable;
};

const deserializeRequest = serializedRequest => new Request(serializedRequest.url, serializedRequest);

export const enqueue = item => {
  openDatabase().then(db => {
    storeItem(db, QUEUE_NAME, item);
  });
};

export const enqueueRequest = request => enqueue(serializeRequest(request));

export const processQueue = () => {
  openDatabase().then(db => {
    itemCursor(db, QUEUE_NAME)
      .then(cursor => {
        if (!cursor) {
          return;
        }
        return cursor;
      })
      .then(function handleItem(cursor) {
        if (!cursor) {
          return;
        }
        const req = deserializeRequest(cursor.value);
        const currentKey = cursor.value.__generatedKey;
        fetch(req)
          .then(() => {
            deleteItem(db, QUEUE_NAME, currentKey);
          })
          .catch(error => {
            console.log(`Could not update backend for item ${currentKey}. Keep in datbase`);
          });
        cursor.continue().then(handleItem);
      });
  });
};
