// Simple Parser by mr.ebola
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var files = ['/home/dev/Documents/BreachCompilation/data/g/g'];

MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("leaksmongo"); 

      for (var i = 0; i < files.length; i++) {
        var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(files[i])
        });
        lineReader.on('line', function (line) {
          var myarr = line.split(":");
          var myobj = { mail:  myarr[0] , pass:  myarr[1] };
        dbo.collection("leaksdb").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log(myarr[0] + " document inserted");       
        });
        });
      }
});