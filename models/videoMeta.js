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


//Create Schema¨and Model
const videoMetaSchema = new Schema({
  //Hemter fra IMAGE tag i json videometafil
  "absolute_path": String,
  "filnavn": String,
  "date": Date,
  //Henter fra DURATION.seconds
  "duration": Number,
  "container": String,
  "resolution_w": Number,
  "resolution_h": Number,
  "fps": Number

  });

//Vil lage en collection med navn bibinfo
const videoMeta = mongoose.model('videoMeta', videoMetaSchema);

//Gjør denne tilgjengelig i andre filer.
module.exports = videoMeta;
db.close();
