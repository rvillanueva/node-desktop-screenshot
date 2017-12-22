var fs = require('fs');
var ResponseHandler = require('./response');
var Capturer = require('./capture');
var ImageProcessor = require('./processor');
var utils = require('./utils');

class Screenshot {
  constructor(args){
    this.capturer = new Capturer();
    this.image = new ImageProcessor();

    var parsedArgs = utils.parseArgs(args);
    this.options = parsedArgs.options;
    this.callback = parsedArgs.callback;
    this.writePath = parsedArgs.writePath;
    this.res = new ResponseHandler(this.callback);

    this.take()
  }
  async take(){
    try {
      var rawCapturePath = await this.capturer.getRawCapture(this.writePath)
      await this.applyTransformationsIfNeeded(rawCapturePath, this.options)
      this.res.send();
    } catch(e){
      this.res.error(e);
    }
    return;
  }

  async applyTransformationsIfNeeded(rawCapturePath, options){
    if(transformationsNeeded(options)){
      await this.image.loadFile(rawCapturePath)
      this.image.resize(options.width, options.height);
      this.image.changeQuality(options.quality);
      this.image.write(this.writePath);
    }
    return;
  };
}

function transformationsNeeded(options){
  return typeof options.width == "number" ||
  typeof options.height == "number" ||
  typeof options.quality == "number"
}

module.exports = Screenshot;
