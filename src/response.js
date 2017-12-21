class ResponseHandler {
  constructor(callback){
    this.callback = callback;
  }
  error(err){
    if(typeof this.callback == 'function'){
      this.callback(err, null);
    }
  }
  send(data){
    if(typeof this.callback == 'function'){
      this.callback(null, data);
    }
  }
}

module.exports = ResponseHandler;
