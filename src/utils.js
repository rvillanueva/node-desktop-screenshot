var path = require('path');
var fs = require('fs');

function throwError(str){
  throw new Error(str);
}

function parseArgs(args){
  var parsed = {
    options: {}
  };
  validateArgs(args);
  parsed.writePath = args['0'];

  if(typeof args['1'] === 'function'){
    parsed.callback = args['1'];
  } else if(typeof args['1'] === 'object') {
    parsed.options = args['1'];
  }
  if(typeof args['2'] === 'function'){
    parsed.callback = args['2'];
  }
  return parsed;
}

function validateArgs(args){
  if(typeof args['0'] !== 'string'){
    throwError('First argument must be a string, got ' + typeof args['0'])
  }
  if(typeof args['1'] !== 'function' && typeof args['1'] !== 'object' && typeof args['1'] !== 'undefined'){
    throwError('Second argument must be a function or object, got ' + typeof args['1'])
  }
  if(typeof args['2'] !== 'function' && typeof args['2'] !== 'undefined'){
    throwError('Third argument must be a function, got ' + typeof args['2'])
  }
}

function deleteFile(path){
  return new Promise((resolve, reject) => {
    fs.unlink(path, err => {
      if(err){
        reject(err)
        return;
      }
      resolve();
    });
  })
}

function getExtensionFromPath(path){
    var split = path.split('.');
    return split[split.length - 1];
}

module.exports = {
  parseArgs: parseArgs,
  deleteFile: deleteFile,
  getExtensionFromPath: getExtensionFromPath
}
