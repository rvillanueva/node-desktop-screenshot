var fs = require('fs');

class Capturer {
  constructor(){
    this.module;
    this.moduleMap = {
      'linux': 'linux.js',
      'freebsd': 'linux.js',
      'darwin': 'darwin.js',
      'win32': 'win32.js'
    }
    this.init();
  }
  init(){
    try{
      fs.mkdirSync(path.join(__dirname, '../../tmp'))
    } catch(e){}
    try {
      var moduleName = this.getModuleName();
      this.module = require("./" + moduleName);
    } catch (e){
      console.error(e);
      throw new Error('Module for platform ' + process.platform + ' could not be loaded.')
    }
  }
  getModuleName(){
    return this.moduleMap[process.platform];
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
