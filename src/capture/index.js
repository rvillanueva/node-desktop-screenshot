class Capturer {
  constructor(){
    this.module;
    this.init();
  }
  init(){
    try {
      this.module = require("./" + process.platform + ".js");
    } catch (e){
      throw new Error('Module for platform ' + platform + ' could not be loaded.')
    }
  }
  take(options, callback){
    return this.module(options, callback);
  }
}

module.exports = Capturer;
