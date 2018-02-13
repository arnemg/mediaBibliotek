const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema¨and Model
const BibInfoSchema = new Schema({
  "absolute_path": String,
  "filnavn": String,
  "size": Number,
  "atime":Date,
  "mtime": Date,
  "ctime": Date,
  "birthtime": Date
});

//Vil lage en collection med navn bibinfo
const BibInfo = mongoose.model('bibinfos', BibInfoSchema);

//Gjør denne tilgjengelig i andre filer.
module.exports = BibInfo;
