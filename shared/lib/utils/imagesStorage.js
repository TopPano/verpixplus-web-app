import localforage from 'localforage';

function load (storageId, idx) {
  return localforage.setDriver(localforage.INDEXEDDB).then(() => {
    const key = `verpixplus/${storageId}/img${idx}`;
    return localforage.getItem(key);
  })
}

function save (storageId, idx, imgDataUrl) {
  return localforage.setDriver(localforage.INDEXEDDB).then(() => {
    const key = `verpixplus/${storageId}/img${idx}`;
    return localforage.setItem(key, imgDataUrl);
  })
}

export default {
  load,
  save
};
