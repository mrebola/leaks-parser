// Simple Parser by mr.ebola
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var files = [ 'file.in', 'test.in'];

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("leaksmongo"); 
  var lineReader = require('readline').createInterface({
  
  input: require('fs').createReadStream(files[0])
  });
  lineReader.on('line', function (line) {
    var myarr = line.split(":");
    var myobj = { mail:  myarr[0] , pass:  myarr[1] };
  dbo.collection("leaksdb").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
  });
});