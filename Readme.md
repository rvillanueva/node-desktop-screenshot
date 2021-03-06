# node-desktop-screenshot #

[![Build Status](https://travis-ci.org/rvillanueva/node-desktop-screenshot.svg?branch=master)](https://travis-ci.org/rvillanueva/node-desktop-screenshot) [![Coverage Status](https://coveralls.io/repos/github/rvillanueva/node-desktop-screenshot/badge.svg?branch=master)](https://coveralls.io/github/rvillanueva/node-desktop-screenshot?branch=master)

Take a screenshot of the computer on which Node is running, using platform-specific external tools included with the package

Supports Windows (win32), OSX (darwin) and Linux platforms

Windows version uses nircmd (http://nircmd.nirsoft.net)
Linux version uses scrot

## Install ##

Install with `npm install desktop-screenshot`

## Available Options ##

- quality: JPEG quality (0 to 100)
- width: use in conjunction with height, or by itself to maintain aspect ratio
- height: use in conjunction with width, or by itself to maintain aspect ratio

## Examples ##

### Full resolution ###
	var screenshot = require('desktop-screenshot');

    screenshot("screenshot.png", function(error, complete) {
        if(error)
            console.log("Screenshot failed", error);
        else
            console.log("Screenshot succeeded");
    });

### Resize to 400px wide, maintain aspect ratio ###

    var screenshot = require('desktop-screenshot');

    screenshot("screenshot.png", {width: 400}, function(error, complete) {
        if(error)
            console.log("Screenshot failed", error);
        else
            console.log("Screenshot succeeded");
    });

### Resize to 400x300, set JPG quality to 60% ###

    var screenshot = require('desktop-screenshot');

    screenshot("screenshot.jpg", {width: 400, height: 300, quality: 60}, function(error, complete) {
        if(error)
            console.log("Screenshot failed", error);
        else
            console.log("Screenshot succeeded");
    });

## Tests ##

Install test dependencies using `npm install -g mocha nyc`.

Run `npm test` to run tests, `npm run coverage` for code coverage.

## TODOs ##

- Multi-screen support
- Cropping
- Return contents of image, rather than writing file
