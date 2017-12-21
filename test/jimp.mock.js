class MockJimp {
  constructor(image, cb){
    this.image = image;
    this.cb = cb;
  }
  returnError(err){
    this.cb(err, null);
  }
  returnNoImage(){
    this.cb(null, null);
  }
  write(options, cb){
    cb();
  }
}

module.exports = MockJimp;
