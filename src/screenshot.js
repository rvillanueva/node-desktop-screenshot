var path = require('flavored-path');
var fs = require('fs');
var ResponseHandler = require('./response');
var Capturer = require('./capture');
var ImageManipulator = require('./manipulator');
var utils = require('./utils');

class Screenshot {
  constructor(args){
    this.capturer = new Capturer();
    this.imageManipulator = new ImageManipulator();

    var parsedArgs = utils.parseArgs(args);
    this.options = parsedArgs.options;
    this.callback = parsedArgs.callback;
    this.writePath = this.options.output;

    this.res = new ResponseHandler(this.callback);
    
    this.take()
  }
  async take(){
    try {
      var rawCapturePath = await this.capturer.getRawCapture(this.writePath)
      await this.applyTransformationsIfNeeded(rawCapturePath, this.options)
      await this.cleanupRawCaptureIfNeeded(rawCapturePath, this.writePath);
      this.res.send();
      return;
    } catch(e){
      this.res.error(e);
      return;
    }
  }

  applyTransformationsIfNeeded(rawCapturePath, options){
    return new Promise((resolve, reject) => {
      if(noTransformationsNeeded(options)){
        resolve();
      } else {
        this.imageManipulator.loadFile(rawCapturePath)
        .then(data => {
          this.imageManipulator.resize(options.width, options.height);
          this.imageManipulator.changeQuality(options.quality);
          this.imageManipulator.write(this.writePath);
          resolve();
        })
        .catch(err => reject(err))
      }
    })
  };

  cleanupRawCaptureIfNeeded(rawCapturePath, outputPath){
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
