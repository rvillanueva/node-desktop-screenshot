var jimp = require('jimp');

class ImageManipulator {
  constructor(){
  }
  applyTransformationsAndWrite(input, options){
    return new Promise((resolve, reject) => {
      new jimp(input, (err, image) => {
        if(err){
          reject(err);
          return;
        }
        this.resize(image, options.width, options.height);
        this.changeQuality(image, options.quality);
        image.write(options.output);
        resolve();
      })
    })
  }
  resize(image, width, height){
    var newWidth, newHeight;
    if(typeof width === "number"){
      newWidth = Math.floor(width);
    }
    if(typeof height === "number"){
      newHeight = Math.floor(height);
    }

    if(typeof newWidth === "number" && typeof resHeight !== "number") // resize to width, maintain aspect ratio
      newHeight = Math.floor(this.image.bitmap.height * (newWidth / this.image.bitmap.width));
    else if(typeof resHeight === "number" && typeof resWidth !== "number") // resize to height, maintain aspect ratio
      newWidth = Math.floor(this.image.bitmap.width * (newHeight / this.image.bitmap.height));

    image.resize(newWidth, newHeight)
  }
  changeQuality(image, quality){
    if(typeof quality === "number" && quality >= 0 && quality <= 100){
      image.quality(Math.floor(quality)); // only works with JPEGs
    }
  }
}

module.exports = ImageManipulator;
