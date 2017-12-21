var path = require('flavored-path');
var jimp = require('jimp');
var fs = require('fs');
var ResponseHandler = require('./response');
var Capturer = require('./capture');
var utils = require('./utils');

class Screenshot {
  constructor(args){
    this.config = utils.parseArgs(args);
    this.capturer = new Capturer();
    this.res = new ResponseHandler(this.config.callback);
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
      if (typeof options.intermediate === "string") {
        this.handleIntermediateImage(options)
      } else {
        this.processImage(options.output, options.output, options, this.res);
      }
    });
  }

  processImage(input, output, options, res){
  	if(!input){
  		this.res.error(new Error('No image to process.'))
      return;
  	}
  	if(typeof options.width !== "number" && typeof  options.height !== "number" && typeof options.quality !== "number") // no processing required
  		this.res.send();
  	else {
  		new jimp(input, (err, image) => handleJimpResponse(err, image, this.res));
    }
  };

  handleIntermediateImage(options){
    // delete intermediate
    this.processImage(options.intermediate, options.output, options, function (error, success) {
      fs.unlink(options.intermediate, err => {
        if(err){
          this.res.error(err);
          return;
        }
        this.res.send();
      });
    });
  }
}


function handleJimpResponse(err, image, res){
  if(err){
    res.error(err);
    return;
  }
  if(!image){
    res.error(new Error('No image received from jimp.'));
    return;
  }
  if(typeof options.width === "number")
    var resWidth = Math.floor(options.width);
  if(typeof options.height === "number")
    var resHeight = Math.floor(options.height);

  if(typeof resWidth === "number" && typeof resHeight !== "number") // resize to width, maintain aspect ratio
    var resHeight = Math.floor(image.bitmap.height * (resWidth / image.bitmap.width));
  else if(typeof resHeight === "number" && typeof resWidth !== "number") // resize to height, maintain aspect ratio
    var resWidth = Math.floor(image.bitmap.width * (resHeight / image.bitmap.height));

  try {
    image.resize(resWidth, resHeight);

    if(typeof options.quality === "number" && options.quality >= 0 && options.quality <= 100)
      image.quality(Math.floor(options.quality)); // only works with JPEGs

    image.write(output, (err, data) => {
      if(err){
        res.error(err);
        return;
      }
      res.send(data);
    });
  } catch(error) {
    res.error(error);
    return;
  }
}

module.exports = Screenshot;
