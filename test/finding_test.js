const assert = require('assert');
const BibInfo = require('../models/bibinfo');

// Må desctibe() hva testen(e) skal gjøre - Felles overskrift
describe("MongoDB functionality - Finner noe i basen", function(){
  //Her inne er hver enkelt test
  beforeEach(function(done){
    var dato = Date();
    //Assert er hva du forventer true/false/value/osv
    var info = new BibInfo({
      "absolute_path": "Dette skal være PATH",
      "filnavn": "Testfilnavn.txt",
      "mdate": dato
      });
      //save the record to the database,
      //asynk funksjon, dvs VI MÅ VENTE til den er ferdig
      //så har vi PROMISE interface, which has the .then() method.
      info.save().then(function(){
        //isNew db egenskap - som vi bruker for å finne ut om den er lagret
        //isNew returns false when it has been saved.  isNew=true, when lokal save
        assert(info.isNew === false);
        //done kommer fra mocha og passed in the it() funskjon
        done();
      });
    }); //beforeEach


  //IT BLOCK - for å lage en testen
  //Skal teste: 1. Opprett en ny BibInfo model, and add data and save
  it('Finds one record in the db', function(done){
    BibInfo.findOne({filnavn: 'Testfilnavn.txt'}).then(function(result){
      assert(result.filnavn === 'Testfilnavn.txt');
      done();
    })

  });// it - find one record

});//describe
