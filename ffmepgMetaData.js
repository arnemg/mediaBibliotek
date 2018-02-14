var fs = require('fs');
var ffmpeg = require('ffmpeg');
var ExifImage = require('exif').ExifImage;
const videInfo = require('./models/videoMeta');
const bildeInfo = require('./models/bildeMeta');

error_fil = fs.createWriteStream("Error_File_UpdateDB.log");
//bilde_fil.write(JSON.stringify(detteBildeMeta));

//var dir = "D:/Bildene/Bilder";
var dir = './media';
//var dir = '../tmp';

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

walk(dir, function(err, results) {
  if (err) throw err;
    results.forEach(function(sti){
      var filnavnet = sti.substring(sti.lastIndexOf('/') + 1, sti.length - 4);
      var mediaExt = ["mp4", "avi", "mpg", "mov", "wmv"];
      var bildeExt = ["jpg", "gif", "png"];

      /** FFMPEG funksjon for å hente metadata ------------------VIDEO **/
      if(mediaExt.includes(sti.substring(sti.length-3)) ){
        try {
    			var process = new ffmpeg(sti);
    			process.then(function (video) {
            fs.stat(sti, function(err, stats){
                  var denneVideoMeta = new videInfo({
                      "absolute_path": sti,
                      "filnavn": filnavnet,
                      "date": video.metadata.date,
                      "duration": video.metadata.duration.seconds,
                      "container": video.metadata.video.container,
                      "resolution_w": video.metadata.video.resolution.w,
                      "resolution_h": video.metadata.video.resolution.h,
                      "fps": video.metadata.video.aspect.fps
                    });

                  denneVideoMeta.save().then(function(done){
                    console.log("-------> Saved V I D E O  til databasen <----------");
                    done();
                  });

              });
          }, function (err) {
            error_fil.write("Feil i å skrive til fil --> " + err);
    				//console.log('ERR  write file: ' + err);
    			});//function err
    		} catch (e) {
                      error_fil.write("try ERR--> e.code og e.msg " + e.code + e.msg);
                      //console.log("try ERR--> e.code og e.msg " + e.code + e.msg);
                    }

      /** EXIF funksjon for å hente metadata  ------------------BILDE**/
    }else if(bildeExt.includes(sti.substring(sti.length-3).toLowerCase()) ){
        try {
            new ExifImage( sti, function (error, exifData) {
                if (error)
                    error_fil.write('Exif ERR: ' + filnavnet +error.message);
                    //console.log('Exif ERR: ' + filnavnet +error.message);
                else
                    try{
                      var detteBildeMeta = new bildeInfo({
                        "absolute_path": sti,
                        "filnavn": filnavnet,
                        "ModifyDate": exifData.image.ModifyDate,
                        "Model": exifData.image.Model,
                        "Make": exifData.image.Make,
                        "CreateDate": exifData.exif.CreateDate,
                        "ExifImageHeight": exifData.exif.ExifImageHeight,
                        "ExifImageWidth": exifData.exif.ExifImageWidth,
                        "DateTimeOriginal": exifData.exif.DateTimeOriginal,
                        "GPSLongitude": exifData.gps.GPSLongitude,
                        "GPSLatitude": exifData.gps.GPSLatitude
                      });

                      detteBildeMeta.save().then(function(done){
                        console.log("-------> Saved B I L D E T til databasen <----------");
                        done();
                      });

                    }catch(error){
                        error_fil.write("Næmmen noe har feilet har feilet ERR --> " + error);}
            });
        } catch (error) {
              error_fil.write('TryNext ERR: ' +  error.message);
        }
      }
    });//forEach Results
});//walk
    error_fil.close();
