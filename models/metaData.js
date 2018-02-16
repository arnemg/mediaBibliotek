const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Set up default mongoose connection
//var mongoDB = 'mongodb://127.0.0.1/MediaMetaData';
var mongoDB = 'mongodb://test:test@ds133558.mlab.com:33558/media'
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
const metadataSchema = new Schema({
  "media": {type: String, required: [true, 'Skal enten vaere Video eller Bilde']},
  "duration": Number,
  "container": String,
  "resolution_w": Number,
  "resolution_h": Number,
  "fps": Number,
  "absolute_path": String,
  "filnavn": String,
  "ModifyDate": String,
  "Make": String,
  "Model": String,
  "CreateDate": String,
  "ExifImageHeight": Number,
  "ExifImageWidth": Number,
  "DateTimeOriginal": String,
  //"geometry": GeoSchema
  });

//Vil lage en collection med navn bibinfo
const metadataModel = mongoose.model('MediaMetadata', metadataSchema);

//Gjør denne tilgjengelig i andre filer.
module.exports = metadataModel;
