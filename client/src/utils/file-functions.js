const Promiseb = require('bluebird');
const BrowserFS = require('browserfs');

// turns off forgotten return warning in Bluebird
Promiseb.config({
  warnings: {
    wForgottenReturn: false
  }
});

const fsp = Promiseb.promisifyAll(require('fs'));

function initializationPromise(dir) {
  return new Promise((resolve, reject) => {
    const html5fs = new BrowserFS.FileSystem.HTML5FS(10, window.TEMPORARY);
    html5fs.allocate(() => {
      resolve();
    });
    BrowserFS.initialize(html5fs);
  });
}

const getAllFiles = (dir) => {
  let fileStatPromises;
  return fsp.readdirAsync(dir)
    .then(fileNamesArr => {
      fileStatPromises = fileNamesArr.map(fileName => {
        return fsp.statAsync(`${dir}/${fileName}`)
          .then(stats => {
            const file = {};
            file.filePath = `${dir}/${fileName}`;
            file.isDirectory = !stats.isFile();
            if (stats.isDirectory() === true) {
              return getAllFiles(file.filePath)
              .then(fileNamesSubArr => {
                file.files = fileNamesSubArr;
                return file;
              })
              .catch(error => console.error(error));
            }
            return file;
          });
      });
      return Promiseb.all(fileStatPromises);
    });
};
let rootStartingIndex;
const mkDirStructure = (tree) => {
  console.log('tree: ', tree)
  if (!rootStartingIndex && tree[0]) {
    rootStartingIndex = tree[0].filePath.lastIndexOf('/');
  }
  const filePromises = tree.map(file => {
    if (file.isDirectory) {
      return fsp.mkdirAsync(file.filePath.slice(rootStartingIndex))
        .then(() => mkDirStructure(file.filePath))
        .catch(error => console.error(error));
    }
    return file;
  });
  return Promiseb.all(filePromises);
};

const writeFile = (path, file) => fsp.writeFileAsync(path, file);
const exists = (path) => fsp.existsAsync(path);


module.exports = {
  getAllFiles, writeFile, initializationPromise, exists, mkDirStructure
};
