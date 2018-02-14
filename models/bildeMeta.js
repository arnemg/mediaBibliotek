const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/media';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const GeoSchema = new Schema({
  type:{
    type: String,
    default: "Point"
  },
  coordinates: {
    type: [Number],
    index: "2dsphere"
  }
});

//Create Schema and Model
const bildeMetaSchema = new Schema({
  //Hemter fra IMAGE tag i json bildemetafil
  "absolute_path": String,
  "filnavn": String,
  "ModifyDate": String,
  //Henter fra EXIF
  "Make": String,
  "Model": String,
  "CreateDate": String,
  "ExifImageHeight": Number,
  "ExifImageWidth": Number,
  "DateTimeOriginal": String,
  //Henter fra GPS
  "GPSLongitude":[{"Null": Number, "En": Number, "To": Number}],
  "GPSLatitude": [{"Null": Number, "En": Number, "To": Number}]
  });

//Vil lage en collection med navn bibinfo
const bildeMetaModel = mongoose.model('bildeMeta', bildeMetaSchema);

//Gjør denne tilgjengelig i andre filer.
module.exports = bildeMetaModel;
db.close();
