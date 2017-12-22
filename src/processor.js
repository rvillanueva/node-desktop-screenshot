var Jimp = require('jimp');

class ImageProcessor {
  constructor(){
    this.image;
  }
  loadFile(filePath){
    return new Promise((resolve, reject) => {
      Jimp.read(filePath)
      .then(image => {
        this.image = image;
        resolve()
      })
      .catch(err => reject(err))
    })
  }
  resize(width, height){
    var newWidth, newHeight;
    if(typeof width === "number"){
      newWidth = Math.floor(width);
    }
    if(typeof height === "number"){
      newHeight = Math.floor(height);
    }

    if(typeof newWidth === "number" && typeof newHeight !== "number") // resize to width, maintain aspect ratio
      newHeight = Math.floor(this.image.bitmap.height * (newWidth / this.image.bitmap.width));
    else if(typeof resHeight === "number" && typeof newH !== "number") // resize to height, maintain aspect ratio
      newWidth = Math.floor(this.image.bitmap.width * (newHeight / this.image.bitmap.height));

    this.image.resize(newWidth, newHeight)
  }
  changeQuality(quality){
    if(typeof quality !== "number"){
      return;
    }
    if(quality >= 0 && quality <= 100){
      this.image.quality(Math.floor(quality)); // only works with JPEGs
    } else {
      console.error('Quality must be a number between 0 and 100 inclusive.')
    }
  }
  write(outputPath){
    this.image.write(outputPath)
  }
}

module.exports = ImageProcessor;
