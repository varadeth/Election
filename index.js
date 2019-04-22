var http = require('http');
var express = require('express');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/',function(req,res) {
	res.sendFile('F:/Academics/SEM7/pro/New folder/Election/src/index.html')
});

app.get('/admin.html',function(req,res) {
	res.sendFile('F:/Academics/SEM7/pro/New folder/Election/src/addCandidate.html');
});
app.get('/addCandidate.html',function(req,res) {
	res.sendFile('F:/Academics/SEM7/pro/New folder/Election/src/addCandidate.html');
});
app.listen(3000);
console.log('Server started at 3000');


app.get('/app.js',function(req,res){
	res.sendFile('F:/Academics/SEM7/pro/New folder/Election/src/js/app.js');
})

app.post('/login.html',function(req,res) {
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
				res.sendFile('F:/Academics/SEM7/pro/New folder/Election/src/vote.html');
		});
		db.close();
	});
})