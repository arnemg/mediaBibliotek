var fs = require('fs');
var ffmpeg = require('ffmpeg');
var ExifImage = require('exif').ExifImage;
const videInfo = require('./models/videoMeta');
const bildeInfo = require('./models/bildeMeta');

//var dir = "D:/Bildene/Bilder";
//var dir = './media';
var dir = '../tmp';
console.log("------------------- A B O U T   T O    W A L K  -----------------");
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
  var countdown = results.length;
  var feilfiler=0;
  console.log("------------------- W A L K I N G   F O R  --> "+ countdown + " <-- S T E P S ------");
    results.forEach(function(sti){
      var filnavnet = sti.substring(sti.lastIndexOf('/') + 1, sti.length - 4);
      var mediaExt = ["mp4", "avi", "mpg", "mov", "wmv" , "3gp"];
      var bildeExt = ["jpg", "gif", "png"];
      var error_fil = fs.createWriteStream("Error_File_UpdateDB.log");

      /** FFMPEG funksjon for å hente metadata ------------------VIDEO **/
      if(mediaExt.includes(sti.substring(sti.length-3).toLowerCase()) ){
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
                    countdown--;
                    console.log("-------> Saved V I D E O  " + countdown + " til databasen <----------");
                    //done();
                  });

              });
          }, function (err) {
            console.log("Feil i å skrive til fil --> " + err);
    				//console.log('ERR  write file: ' + err);
    			});//function err
    		} catch (e) {
                      console.log("try ERR--> e.code og e.msg " + e.code + e.msg);
                      //console.log("try ERR--> e.code og e.msg " + e.code + e.msg);
                    }

      /** EXIF funksjon for å hente metadata  ------------------BILDE**/
    }else if(bildeExt.includes(sti.substring(sti.length-3).toLowerCase()) ){
        try {
            new ExifImage( sti, function (error, exifData) {
                if (error)
                    console.log('Exif ERR: ' + filnavnet +error.message);
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
                        countdown--;
                        console.log("-------> Saved B I L D E T  " + countdown + "  til databasen <----------");
                        //done();
                      });

                    }catch(error){
                        console.log("Næmmen noe har feilet har feilet ERR --> " + error);}
            });//new EXIF
           }catch (error) {
              console.log('TryNext ERR: ' +  error.message);
                }
      }else {
          feilfiler++;
          console.log("************** F E I L NR: " + feilfiler + " ---> " + sti);
          error_fil.write('************** F E I L NR: ' + feilfiler + " ---> " + sti);
      }
    });//forEach Results
});//walk
