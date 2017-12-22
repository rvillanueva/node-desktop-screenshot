var jimp = require('jimp');

class ImageManipulator {
  constructor(){
    this.image;
  }
  loadFile(filePath){
    return new Promise((resolve, reject) => {
      this.image = new jimp(filePath, (err, image) => {
        this.image = image;
        resolve();
      })
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

    if(typeof newWidth === "number" && typeof resHeight !== "number") // resize to width, maintain aspect ratio
      newHeight = Math.floor(this.image.bitmap.height * (newWidth / this.image.bitmap.width));
    else if(typeof resHeight === "number" && typeof resWidth !== "number") // resize to height, maintain aspect ratio
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

module.exports = ImageManipulator;
