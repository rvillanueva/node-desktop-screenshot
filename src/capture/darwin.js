var path = require('path');
var fs = require('fs');

module.exports = function(writePath, callback) {
	var childProcess = require('child_process');
	// due to bug in jpgjs processing OSX jpg images https://github.com/notmasteryet/jpgjs/issues/34
	// when requesting JPG capture as PNG, so JIMP can read it
	var ext = extension(writePath);
	var rawCapturePath = writePath;
	if(ext === "jpeg" || ext === "jpg") {
		try {
			fs.mkdirSync(path.join(__dirname, '../../tmp'));
		} catch(e){

		}
		rawCapturePath = path.resolve(path.join(__dirname, '../../tmp', uniqueId() + ".png")); // create an intermediate file that can be processed, then deleted
	}

	capture(writePath, callbackReturn); // when jpegjs bug fixed, only need this line

	function callbackReturn(error, success) {
		// called from capture
		// callback with options, in case options added
		callback(error, writePath);
	}

	function uniqueId() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	}

	function extension(file) {
		return path.extname(file).toLowerCase().substring(1);
	}

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
				callback(error.toString());
			else
				callback();
		});

		captureChild.stderr.on('data', function(data) {
			callback(data.toString());
		});
	}
};
