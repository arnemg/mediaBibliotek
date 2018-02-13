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

//Drop -- slette Collection - model før vi kjører test skriptene
beforeEach(function(done){
  //drop the Collection
  mongoose.connection.collections.bibinfos.drop(function(){
    done();
  });

});
