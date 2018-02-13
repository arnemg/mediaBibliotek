var fs = require('fs');
var ffmpeg = require('ffmpeg');
var ExifImage = require('exif').ExifImage;

//var dir = "D:/Bildene/Art/Exporterte";
var dir = './media';

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

//Rekursiv funksjon for å traversere fra var dir - results er en array med
// fulle path og filnavn
walk(dir, function(err, results) {
  if (err) throw err;

    results.forEach(function(sti){
      var filnavnet = sti.substring(sti.lastIndexOf('/') + 1, sti.length - 4);
      var mediaExt = ["mp4", "avi", "mpg", "mov"];

      console.log(filnavnet + " har mediaExt -> " + sti.substring(sti.length-3));

      if(mediaExt.includes(sti.substring(sti.length-3)) ){
        try {
    			var process = new ffmpeg(sti);
    			process.then(function (video) {
            fs.stat(sti, function(err, stats){
              var bibMeta = {
                            "absolute_path": sti,
                            "filnavn": filnavnet,
                            "atime":stats.atime,
                            "mtime": stats.mtime,
                            "ctime": stats.ctime,
                            "birthtime": stats.birthtime};
              video_fil.write(JSON.stringify(bibMeta));

            });

            var video_fil = fs.createWriteStream("./metaoutput/" + filnavnet + "_VIDEO_metadata.json");
            video_fil.write(JSON.stringify(video.metadata));

    		  }, function (err) {
    				console.log('ERR  write file: ' + err);
    			});//function err
    		} catch (e) {	console.log("try ERR--> e.code og e.msg " + e.code + e.msg);	}
      }else if(sti.substring(sti.length-3) === 'jpg' ){
        try {
            new ExifImage( sti, function (error, exifData) {
                if (error)
                    console.log('Exif ERR: ' + filnavnet +error.message);
                else
                    try{
                      bilde_fil = fs.createWriteStream("./metaoutput/" + filnavnet + "_BILDE_metadata.json");
                      bilde_fil.write(JSON.stringify(exifData));
                      myObj += exifData;
                    }catch(error){console.log(filnavnet + " har feilet ERR --> " + error);}
            });
        } catch (error) {
            console.log('TryNext ERR: ' + filnavnet + error.message);
        }
      }
    });//forEach Results

});//walk
