import loadjs from 'loadjs';

const importExternalLibrary = url => {
  if (!url) {
    return new Promise((resolve, reject) =>
      reject(new Error('No url in importExternalLibrNry')),
    );
  }
  if (loadjs.isDefined(url)) {
    return new Promise(resolve => {
      resolve();
    });
  }
  loadjs(url, url);
  return new Promise((resolve, reject) => {
    loadjs.ready(url, {
      success: resolve,
      error: reject,
    });
  });
};

export default importExternalLibrary;
