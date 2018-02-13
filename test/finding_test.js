const assert = require('assert');
const BibInfo = require('../models/bibinfo');

// Må desctibe() hva testen(e) skal gjøre - Felles overskrift
describe("MongoDB functionality - Finner noe i basen", function(){
 var info;
  beforeEach(function(done){
    var dato = Date();
    //Assert er hva du forventer true/false/value/osv
    info = new BibInfo({
      "absolute_path": "Dette skal være PATH",
      "filnavn": "Testfilnavn.txt",
      "mdate": dato
      });

      info.save().then(function(){
        done();
      });
    }); //beforeEach


  it('Finds one record in the db', function(done){
    BibInfo.findOne({filnavn: 'Testfilnavn.txt'}).then(function(result){
      assert(result.filnavn === 'Testfilnavn.txt');
      done();
    })

  });// it - find one record

  it('Finds one record by ID in the db', function(done){

    BibInfo.findOne({_id: info._id}).then(function(result){
      //det er bare i assert funksjonen vi må bruke toString
      assert(result._id.toString() === info._id.toString());
      done();
    })

  })


});//describe
