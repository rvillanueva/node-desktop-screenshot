var path = require('flavored-path');
var fs = require('fs');
var ResponseHandler = require('./response');
var Capturer = require('./capture');
var ImageManipulator = require('./manipulator');
var utils = require('./utils');

class Screenshot {
  constructor(args){
    this.config = utils.parseArgs(args);
    this.capturer = new Capturer();
    this.res = new ResponseHandler(this.config.callback);
    this.imageManipulator = new ImageManipulator();
    this.take()
  }
  take(){
    this.capturer.take(this.config.options, (error, options) => {
      // TODO add option for string, rather than file
      if(error){
        this.res.error(error);
        return;
      }
      if(!options.output){
        this.res.error(new Error("No image taken."));
        return;
      }
      this.processImage(options.intermediate || options.input, options.output, options, this.res)
      .then(() => this.handleIntermediateImageRemoval(options))
      .then(data => this.res.send(data))
      .catch(err => this.res.error(err))
    });
  }

  processImage(input, output, options, res){
    return new Promise((resolve, reject) => {
      if(!input){
        resolve(new Error('No image to process.'))
        return;
      }
      if(noTransformationsNeeded(options)){
        resolve();
      } else {
        this.imageManipulator.applyTransformationsAndWrite(input, options)
        .then(data => resolve(data))
        .catch(err => reject(err))
      }
    })
  };

  handleIntermediateImageRemoval(options){
    if(typeof options.intermediate !== 'string'){
      return Promise.resolve();
    }
    return utils.deleteFile(options.intermediate)
  }
}

function noTransformationsNeeded(options){
  return typeof options.width !== "number" &&
  typeof options.height !== "number" &&
  typeof options.quality !== "number"
}

module.exports = Screenshot;
