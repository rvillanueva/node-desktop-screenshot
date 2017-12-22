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
  async getRawCapture(writePath){
    return new Promise((resolve, reject) => {
      this.module(writePath, (err, rawCapturePath) => {
        if(err){
          reject(new Error(err));
          return;
        }
        if(!rawCapturePath){
          reject(new Error('No raw capture path returned.'));
          return;
        }
        resolve(rawCapturePath);
      })

    })
  }
}

module.exports = Capturer;
