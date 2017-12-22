var path = require('path');
var rimraf = require('rimraf');
var fs = require('fs');
var Jimp = require('jimp');

module.exports = {
  createDirectory: function(dirPath){
    return new Promise((resolve, reject) => {
      fs.mkdir(dirPath, err => resolve());
    })
  },
  clearDirectory: function(dirPath){
    return new Promise((resolve, reject) => {
      var allowedPaths = [path.join(__dirname, '../tmp')];
      if(allowedPaths.indexOf(dirPath) > -1){
        rimraf(dirPath, err => {
          if(err){
            reject(err);
            return;
          }
          resolve();
        })
      } else {
        reject(dirPath + ' is not an allowed path to clear.')
      }
    })
  },
  getImageSizeFromPath: function(path){
    return new Promise((resolve, reject) => {
      Jimp.read(path)
      .then(image => {
        resolve({
          width: image.bitmap.width,
          height: image.bitmap.height
        });
      })
      .catch(err => reject(err))
    })
  }
}
