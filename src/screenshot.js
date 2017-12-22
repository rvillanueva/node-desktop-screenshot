var path = require('flavored-path');
var fs = require('fs');
var ResponseHandler = require('./response');
var Capturer = require('./capture');
var ImageManipulator = require('./manipulator');
var utils = require('./utils');

class Screenshot {
  constructor(args){
    var parsedArgs = utils.parseArgs(args);
    this.options = parsedArgs.options;
    this.callback = parsedArgs.callback;
    this.writePath = this.options.output;
    this.capturer = new Capturer();
    this.res = new ResponseHandler(this.callback);
    this.imageManipulator = new ImageManipulator();
    this.take()
  }
  async take(){
    try {
      var rawCapturePath = await this.capturer.getRawCapture(this.writePath)
      this.processImage(rawCapturePath, this.options)
      var data = await this.cleanupRawCapture(rawCapturePath, this.writePath)
      this.res.send(data);
      return;
    } catch(e){
      this.res.error(e);
      return;
    }
  }

  processImage(rawCapturePath, options){
    return new Promise((resolve, reject) => {
      if(noTransformationsNeeded(options)){
        resolve();
      } else {
        this.imageManipulator.applyTransformationsAndWrite(rawCapturePath, options)
        .then(data => resolve(data))
        .catch(err => reject(err))
      }
    })
  };

  cleanupRawCapture(rawCapturePath, outputPath){
    if(rawCapturePath !== outputPath){
      return utils.deleteFile(rawCapturePath)
    } else {
      return Promise.resolve();
    }
  }
}

function noTransformationsNeeded(options){
  return typeof options.width !== "number" &&
  typeof options.height !== "number" &&
  typeof options.quality !== "number"
}

module.exports = Screenshot;
