var fs = require('fs');
var ffmpeg = require('ffmpeg');
var ExifImage = require('exif').ExifImage;
const videInfo = require('./models/videoMeta');
const bildeInfo = require('./models/bildeMeta');

var dir = "D:/Bildene/Bilder";
//var dir = './media';
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
      //Ny instans av Schema for bilde og video



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
                  //var video_fil = fs.createWriteStream("./metaoutput/" + filnavnet + "_VIDEO_metadata.json");
                  //video_fil.write(JSON.stringify(denneVideoMeta));

                  denneVideoMeta.save().then(function(done){
                    console.log("-------> Saved V I D E O  til databasen <----------");
                    done();
                  });

              });
          }, function (err) {
    				console.log('ERR  write file: ' + err);
    			});//function err
    		} catch (e) {	console.log("try ERR--> e.code og e.msg " + e.code + e.msg);	}

      /** EXIF funksjon for å hente metadata  ------------------BILDE**/
    }else if(bildeExt.includes(sti.substring(sti.length-3).toLowerCase()) ){
        try {
            new ExifImage( sti, function (error, exifData) {
                if (error)
                    console.log('Exif ERR: ' + filnavnet +error.message);
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
                      //bilde_fil = fs.createWriteStream("./metaoutput/" + filnavnet + "_BILDE_metadata.json");
                      //bilde_fil.write(JSON.stringify(detteBildeMeta));

                      detteBildeMeta.save().then(function(done){
                        console.log("-------> Saved B I L D E T til databasen <----------");
                        done();
                      });

                    }catch(error){console.log(filnavnet + " har feilet ERR --> " + error);}
            });
        } catch (error) {
            console.log('TryNext ERR: ' + filnavnet + error.message);
        }
      }
    });//forEach Results
});//walk
