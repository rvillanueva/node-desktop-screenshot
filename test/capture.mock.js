class MockCapture {
  constructor(){
    this.response;
    this.error;
  }
  simulateMissing(){

  }
  getFunction(){
    return this.capture(this.error, this.response);
  }
  capture(err, res){
    return function(options, callback){
      if(typeof callback === 'function'){
        callback(err, res);
      }
    }
  }
}

module.exports = MockCapture;
