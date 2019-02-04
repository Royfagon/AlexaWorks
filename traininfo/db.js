/*
const stitch = require("mongodb-stitch")

const clientPromise = stitch.StitchClientFactory.create('musicbox-prqlf');

clientPromise.then(client => {
  const db = client.service('mongodb', 'mongodb-atlas').db('jukebox');

  console.log("authedId:", client.authedId());

  client.login().then(() =>
    db.collection('stations').count()
  ).then(() =>
    db.collection('stations').find({owner_id: client.authedId()}).limit(100).execute()
  ).then(docs => {
    console.log("Found docs", docs)
    console.log("[MongoDB Stitch] Connected to Stitch")
  }).catch(err => {
    console.error(err)
  });
});
*/


var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb+srv://royfagon:Hall0w33n@cluster0.mongodb.net/";
MongoClient.connect(uri, function(err, client) {
  const collection = client.db("jukebox").collection("artist_album");
   // perform actions on the collection object
   console.log("collection", collection);
   client.close();
});
