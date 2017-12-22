var fs = require('fs');
var childProcess = require('child_process');
var path = require('path');

function capture(writePath, callback){
	var scrot = childProcess.spawn("import", [ "-window", "root", writePath ]);
	scrot.on('close', function(code, signal) {
		try {
			fs.statSync(writePath);
			callback(null, writePath); // callback with options, in case options added
		}
		catch(error) {
			console.error(error);
			callback("file_not_found", null);
		}
	});
}

module.exports = capture;
