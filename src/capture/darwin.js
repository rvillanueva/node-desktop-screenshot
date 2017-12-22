var path = require('path');
var fs = require('fs');
var childProcess = require('child_process');

function capture(writePath, callback) {
	var cmd = "screencapture";
	var args = [
		// will create PNG by default
		"-t",
		path.extname(writePath).toLowerCase().substring(1),
		"-x",
		writePath
	];

	var captureChild = childProcess.spawn(cmd, args);

	captureChild.on('close', function(error) {
		if (error)
			callback(error.toString(), null);
		else
			callback(writePath);
	});

	captureChild.stderr.on('data', function(data) {
		callback(data.toString());
	});
}


module.exports = capture;
