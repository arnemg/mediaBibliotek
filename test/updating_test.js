const assert = require('assert');
const BibInfo = require('../models/bibinfo');

// Må desctibe() hva testen(e) skal gjøre - Felles overskrift
describe("MongoDB functionality - Updating record", function(){

 var info;
  beforeEach(function(done){
    var dato = Date();
    //Assert er hva du forventer true/false/value/osv
    info = new BibInfo({
      "absolute_path": "Dette skal være PATH",
      "filnavn": "Testfilnavn.txt",
      "size": 350,
      "mdate": dato
      });

      info.save().then(function(){
        done();
      });
    }); //beforeEach


  it('Update one record in the db', function(done){

    BibInfo.findOneAndUpdate({filnavn: 'Testfilnavn.txt', filnavn: 'LiveFile.txt'}).then(function(){
      BibInfo.findOne({_id: info._id}).then(function(result){
        assert(result.filnavn ===   'LiveFile.txt');
        done();
      });
    });

  });

  it('Legger til 200 på size db', function(done){

    BibInfo.update({},{$inc: {size: 200}}).then(function(){
      BibInfo.findOne({absolute_path: 'Dette skal være PATH'}).then(function(record){
        assert(record.size === 550);
        done();
      })
    });

  });


});//describe
