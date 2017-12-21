class MockCapture {
  constructor(){
    this.response = {
      intermediate: undefined,
      output: undefined
    };
    this.error;
  }
  simulateMissing(){

  }
  take(options, callback){
    if(typeof callback === 'function'){
      callback(err, res);
    }
  }

}

module.exports = MockCapture;
