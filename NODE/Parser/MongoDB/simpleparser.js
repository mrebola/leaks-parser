// Simple Parser by mr.ebola
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("leaksmongo"); 
  
  var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('file.in')
  });
  lineReader.on('line', function (line) {
  var myarr = line.split(":");
  //console.log("user:" + myarr[0] + " pass: " + myarr[1]);
    var myobj = { mail:  myarr[0] , pass:  myarr[1] };

  dbo.collection("leaksdb").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
  });
});