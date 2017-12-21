var path = require('flavored-path');
var jimp = require('jimp');
var fs = require('fs');
var ResponseHandler = require('./response');
var Capturer = require('./capture');

function Screenshot(args) {
	var config = this.parseArgs(args);
  var res = new ResponseHandler(config.callback);
  var capturer = new Capturer();
	var self = this;
	capturer.take(config.options, function(error, options) {
		// TODO add option for string, rather than file
    res.send();
		if(error)
			res.error(error);
      return;
    if(!options.output)
			res.error(new Error("No image taken."));
      return;
		if (typeof options.intermediate === "string") {
			self.processImage(options.intermediate, options.output, options, function (error, success) {
				fs.unlink(options.intermediate, handleCallback); // delete intermediate
			});
		} else {
      self.processImage(options.output, options.output, options, res);
    }
	});

	function handleCallback(error, success) {
		if(typeof config.callback === "function") {
			if(typeof success === "undefined")
				success = !error;
			config.callback(error, success);
		}
	}
}

Screenshot.prototype.processImage = function(input, output, options, res) {
	if(!input){
		res.error(new Error('No image to process.'))
    return;
	}
	if(typeof options.width !== "number" && typeof  options.height !== "number" && typeof options.quality !== "number") // no processing required
		res.send();
	else {
		new jimp(input, (err, image) => handleJimpResponse(err, image, res));
  }
};

Screenshot.prototype.parseArgs = function(args) {
	var config = {options: {}};

	for(var property in args) {
		if (args.hasOwnProperty(property)) {
			switch(typeof args[property]) {
				case "string":
					var file = args[property];
					break;
				case "function":
					config.callback = args[property];
					break;
				case "object":
					if(args[property] != null)
						config.options = args[property];
					break;
			}
		}
	}

	if(typeof file === "string")
		config.options.output = file;

	if(typeof config.options.output === "string")
		config.options.output = path.normalize(config.options.output);

	return config;
};

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
