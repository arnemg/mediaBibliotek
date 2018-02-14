const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://test:test@ds133558.mlab.com:33558/media');
before(function(done){
  mongoose.connect('mongodb://localhost/media');
  mongoose.connection.once('open', function(){
    console.log("Connection has been made, now make fireworks..");
    done();
  }).on('error', function(error){
      console.log('Connection error ' + error);
      });
});
