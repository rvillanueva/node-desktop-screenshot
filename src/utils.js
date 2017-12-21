var path = require('path');
var fs = require('fs');

module.exports = {
  parseArgs: function(args){
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
  },
  deleteFile: function(path){
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

}
