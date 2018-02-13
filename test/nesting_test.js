const assert = require('assert');
const mongoose = require('mongoose');
const Author = require('../models/author');

describe('Nesting records', function(){

  //Sletter collection så vi starter med en fresh base
  beforeEach(function(done){
    mongoose.connection.collections.authors.drop(function(){
      done();
    });
  });

  it('Create an author with sub-documents', function(done){

      var pat = new Author({
        name: 'Bjarne Moe Gumø',
        books: [{title: 'Skjærgårdshistorier', pages:186}]
      });

      pat.save().then(function(){
        Author.findOne({name: 'Arn af Gumøy'}).then(function(record){
          assert(record.books.length === 1);
          done();
        });
      });
  });// it(create an author...)

  it('Add a book to an author', function(done){
    var pat = new Author({
      name: 'Bjarne Moe Gumø',
      books: [{title: 'Skjærgårdshistorier', pages: 186}]
    });/// author

    pat.save().then(function(){
      Author.findOne({name: 'Bjarne Moe Gumø'}).then(function(record){
        record.books.push({title: 'Skjærgårdshistorier II', pages: 234});
        record.save().then(function(){
          Author.findOne({name: 'Bjarne Moe Gumø'}).then(function(result){
            assert(result.books.length === 2);
            done();
          });
        });
      });//Author.findOne
    });//pat.save()
 });//it(add book

});// describe
