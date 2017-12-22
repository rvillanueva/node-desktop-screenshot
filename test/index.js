var path = require('path');
var sinon = require('sinon');
var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var main = require('../module');
var testUtils = require('./utils');

var keepTests = false;
var sandbox = sinon.createSandbox();
var Screenshot = require('../src/screenshot');

var tmpPath = path.join(__dirname, '../tmp');

function generateScreenshotPath(ext){
  return path.join(tmpPath, 'screenshot-' + new Date().valueOf() + '.' + ext);
}

beforeEach(done => {
  testUtils.createDirectory(tmpPath)
  .then(() => {
    sandbox.reset();
    done();
  })
})

afterEach(done => {
  if(keepTests){
    done();
    return;
  }
  testUtils.clearDirectory(tmpPath)
  .then(() => done())
});

after(done => {
  sandbox.restore();
  done();
})

describe('when you call screenshot from the main module', () => {
  var screenshotPath = generateScreenshotPath('png');
  beforeEach(done => {
    main(screenshotPath, function(){done()});
  })
  it('writes a screenshot', () => {
    var exists = fs.existsSync(screenshotPath);
    expect(exists).to.be.true;
  })
})

if(!keepTests){
  describe('a test finishes', () => {
    it('properly clears the directory', () => {
      expect(fs.readdirSync(tmpPath).length).to.equal(0);
    })
  })
}

describe('a png screenshot is taken', () => {
  var screenshotPath = generateScreenshotPath('png');
  beforeEach(done => {
    var args = [screenshotPath, function(){done()}];
    new Screenshot(args);
  })
  it('writes a file to the correct path', () => {
    var exists = fs.existsSync(screenshotPath);
    expect(exists).to.be.true;
  })
})

describe('a png screenshot with resize options is taken', () => {
  var screenshotPath = generateScreenshotPath('png');
  var options = {
    width: 100,
    height: 100
  }
  var finalSize;
  beforeEach(done => {
    var args = [screenshotPath, options, function(){
      testUtils.getImageSizeFromPath(screenshotPath)
      .then(size => {
        finalSize = size;
        done();
      })
    }];
    new Screenshot(args)
  })
  it('writes a correctly sized file to the correct path', () => {
    var exists = fs.existsSync(screenshotPath);
    expect(exists).to.be.true;
    expect(finalSize.width === options.width).to.be.true;
    expect(finalSize.height === options.height).to.be.true;
  }).timeout(4000)
})
describe('a jpeg screenshot is taken', () => {
  var screenshotPath = generateScreenshotPath('jpg');
  beforeEach(done => {
    var args = [screenshotPath, function(){done()}]
    new Screenshot(args)
  })
  it('writes a file to the correct path', () => {
    var exists = fs.existsSync(screenshotPath);
    expect(exists).to.be.true;
  })
})

process.on('unhandledRejection', err => {
  console.error(err, err.trace);
})
