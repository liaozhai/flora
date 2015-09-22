var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var findWords = function(db, text, callback) {
  debugger;
  var cursor = db.collection('words').find({ "word": text });
  var docs = [];
  cursor.each(function(err, doc) {
    debugger;
    assert.equal(err, null);
    if (doc != null) {
      docs.push(doc);
    } else {
      callback(docs);
    }
  });
};

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  next();
});

router.post('/find', function(req, res, next) {
  var url = 'mongodb://localhost:27017/words';
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findWords(db, req.body.text, function(words) {
        db.close();
        res.send(words);
    });
  });
});

module.exports = router;
