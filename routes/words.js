var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Bkrs = require('bkrs');
var bkrs = new Bkrs();

var findWords = function(db, text, callback) {
	var cursor = db.collection('words').find({ "word": text });
	var docs = [];
	cursor.each(function(err, doc) {
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
		var w = req.body.text;
		findWords(db, w, function(words) {
				db.close();
				if(words.length){
					res.send(words[0]);
				}
				else {
					bkrs.find(w, function(err, item){
						res.send(item);
					});
				}
		});
	});
});

module.exports = router;
