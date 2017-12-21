var path = require('path');
var rimraf = require('rimraf');
var fs = require('fs');

module.exports = {
  createDirectory: function(dirPath){
    return new Promise((resolve, reject) => {
      console.log(dirPath)
      fs.mkdir(dirPath, err => {
        resolve();
      })
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
  }
}
