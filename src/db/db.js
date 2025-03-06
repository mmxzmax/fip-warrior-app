import { openDB } from 'idb';

const dbName = 'fip-warrior-app';
const storeName = 'cats';

const dbPromise = openDB(dbName, 1, {
  upgrade(db) {
    db.createObjectStore(storeName);
  },
});

export async function getData(key) {
  return (await dbPromise).get(storeName, key);
}
export async function setData(key, val) {
  return (await dbPromise).put(storeName, val, key);
}
export async function delData(key) {
  return (await dbPromise).delete(storeName, key);
}
export async function allData() {
  return (await dbPromise).getAllKeys(storeName);
}