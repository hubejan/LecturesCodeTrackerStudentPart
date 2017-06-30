const Promiseb = require('bluebird');
// const BrowserFS = require('browserfs');

// turns off forgotten return warning in Bluebird
Promiseb.config({
  warnings: {
    wForgottenReturn: false
  }
});

const fsp = Promiseb.promisifyAll(require('fs'));
function initializationPromise (dir) {
  return new Promise((resolve, reject) => {
    var html5fs = new BrowserFS.FileSystem.HTML5FS(10, window.TEMPORARY);
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
        return fsp.statAsync(dir + '/' + fileName)
          .then(stats => {
            const file = {};
            file.filePath = dir + '/' + fileName;
            file.isDirectory = !stats.isFile();
            if (stats.isDirectory == true) {
              return getAllFiles(file.filePath)
              .then(fileNamesSubArr => {
                file.files = fileNamesSubArr;
                return file.files;
              })
              .catch(error => console.error(error));
            }
            return file;
          });
      });
      console.log(fileStatPromises);
      return Promiseb.all(fileStatPromises);
    });
};

module.exports = {
  getAllFiles, initializationPromise
};