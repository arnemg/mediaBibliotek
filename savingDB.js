
const asssert = require('assert');
const BibInfo = require('./models/bibinfo');

    var dato = Date();
    var info = new BibInfo({
      "absolute_path": "Dette skal være PATH",
      "filnavn": "Testfilnavn.txt",
      "atime": dato
      });

    //save the record to the database,
    //asynk funksjon, dvs VI MÅ VENTE til den er ferdig
    //så har vi PROMISE interface, which has the .then() method.
    info.save().then(function(done){
      console.log("Lagret til databasen");
      console.log(info);
      done();
    });
