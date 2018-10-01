import {
  openDatabase,
  storeItem,
  deleteItem,
  itemCursor,
  QUEUE_NAME
} from "./database";

const serializeRequest = request => {
  const cloned = request.clone();

  return cloned.json().then(body => {
    const headers = {};
    for (let pair of cloned.headers.entries()) {
      headers[pair[0]] = pair[1];
    }
    const serializable = {
      url: cloned.url,
      headers,
      method: cloned.method,
      body,
      mode: cloned.mode
    };
    return Promise.resolve(serializable);
  });
};

const deserializeRequest = serializedRequest => {
  return new Request(
    serializedRequest.url,
    Object.assign({}, serializedRequest, {body: JSON.stringify(serializedRequest.body)})
  );
};

export const enqueue = item => {
  openDatabase().then(db => {
    storeItem(db, QUEUE_NAME, item);
  });
};

export const enqueueRequest = request => serializeRequest(request).then(serialized => enqueue(serialized));

export const fetchOrEnqueueRequest = request => {
  const clonedRequest = request.clone();
  return fetch(request)
    .then(response => {
      if (!response.ok) {
        return enqueueRequest(clonedRequest);
      }
      return response;
    })
    .catch(() => {
      return enqueueRequest(clonedRequest);
    });
};

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
        const currentKey = cursor.value.__generatedKey; // eslint-disable-line no-underscore-dangle
        fetch(req).then(() => {
          deleteItem(db, QUEUE_NAME, currentKey);
        });
        cursor.continue().then(handleItem);
      });
  });
};
