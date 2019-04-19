var express = require('express');

var app = express();
var mongo = require('mongodb');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.listen(3000);
console.log('Server started at 3000');
app.use(express.static(__dirname+'/build'));
app.get('/',function(req,res) {
    res.sendFile(__dirname+'/build/index.html');
});

app.post('/vote.html',function(req,res) {
	console.log('Tejas');
	var MongoClient = mongo.MongoClient;
	var url = "mongodb://localhost:27017/";
	var user_name = req.body.username;
	var pass_word = req.body.password;
	MongoClient.connect(url,function(err,db) {
		if(err) throw err;
		var dbo = db.db("E-Voting");
		console.log(user_name);
		dbo.collection("login").findOne({username : user_name},function(err2,result){
			if(err2) throw err2;
			if(result.password==pass_word)
			{
				if(result.type=='admin') {
					res.redirect('/admin.html');
				}
				else {
					res.redirect('/vote.html');
				}
			}
		});
		db.close();
	});
})

app.get('/vote.html',function(req,res) {
	res.sendFile(__dirname+'/src/vote.html');
});

app.get('/admin.html',function(req,res) {
	res.sendFile(__dirname+'/src/admin.html');
});

app.get('/addCandidate.html',function(req,res) {
	res.sendFile(__dirname+'/addCandidate.html');
})