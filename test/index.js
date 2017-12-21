var path = require('path');
var sinon = require('sinon');
var expect = require('chai').expect;
var rewire = require('rewire');
var fs = require('fs');
var path = require('path');
var main = require('../module');
var testUtils = require('./utils');

var sandbox = sinon.createSandbox();
var Screenshot = rewire('../src/screenshot');

var tmpPath = path.join(__dirname, '../tmp');
var screenshotPath = path.join(tmpPath, 'screenshot.png');

beforeEach(done => {
  testUtils.createDirectory(tmpPath)
  .then(() => {
    sandbox.reset();
    done();
  })
})

afterEach(done => {
  testUtils.clearDirectory(tmpPath)
  .then(() => done())
});

after(done => {
  sandbox.restore();
  done();
})

describe('when you call screenshot from the main module', () => {
  beforeEach(done => {
    main(screenshotPath, (err, complete) => {
      if(err){
        throw new Error(err);
      }
      done()
    });
  })
  it('writes a screenshot', () => {
    var exists = fs.existsSync(screenshotPath);
    expect(exists).to.be.true;
  })
})

describe('a png screenshot is taken', () => {
  beforeEach(done => {
    var args = {
      '0': screenshotPath,
      '1': function(err, complete){
        if(err){
          throw new Error(err);
        }
        done();
      }
    }
    new Screenshot(args)
  })
  it('writes a file to the correct path', () => {
    var exists = fs.existsSync(screenshotPath);
    expect(exists).to.be.true;
  })
})

describe('a png screenshot with resize options is taken', () => {
  beforeEach(done => {
    var args = {
      '0': screenshotPath,
      '1': {
        width: 100,
        height: 100
      },
      '2': function(err, complete){
        if(err){
          throw new Error(err);
        }
        done();
      }
    }
    new Screenshot(args)
  })
  it('writes a file to the correct path', () => {
    var exists = fs.existsSync(screenshotPath);
    expect(exists).to.be.true;
  })
})

describe('a jpeg screenshot is taken', () => {
  var screenshotJpegPath = path.join(tmpPath, 'screenshot.jpg');
  beforeEach(done => {
    var args = {
      '0': screenshotJpegPath,
      '1': function(err, complete){
        if(err){
          throw new Error(err);
        }
        done();
      }
    }
    new Screenshot(args)
  })
  it('writes a file to the correct path', () => {
    var exists = fs.existsSync(screenshotJpegPath);
    expect(exists).to.be.true;
  })
})
