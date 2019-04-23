var express = require('express');

var app = express();
var mongo = require('mongodb');

var session = require('express-session');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json()); 
app.use(session({
	resave: 'false',
	saveUninitialized: 'false',
    secret: 'hello'
}));


app.listen(3000);
console.log('Server started at 3000');
app.use(express.static(__dirname+'/build'));
app.get('/',function(req,res) {
    res.sendFile(__dirname+'/src/index.html');
});


app.post('/login.html',function(req,res) {
	var MongoClient = mongo.MongoClient;
	var url = "mongodb://localhost:27017/";
	console.log(req.query);
	var user_name = req.query.username;
	var pass_word = req.query.password;
	MongoClient.connect(url,function(err,db) {
		if(err) throw err;
		var dbo = db.db("E-Voting");
		console.log('In db');
		dbo.collection("login").findOne({username : user_name},function(err2,result){
			if(err2) throw err2;
			if(result.password==pass_word)
			{
				req.session.email = user_name;
				if(result.type=='admin'){
					req.session.admin = 'admin';
					response = 'ADMIN';
				}
				else {
					req.session.admin = 'normal';
					response = 'SUCCESS';
				}
				res.send(response);
			}
			else {
				res.send('ERROR');	
			}
		});
		db.close();
	});
})

app.get('/vote.html',function(req,res) {
	let sess = req.session;
	console.log('Session : '+sess.email);
	if(sess.email) {
		if(sess.admin == 'admin')
			res.sendFile(__dirname+'/src/admin.html');
		else {
			res.sendFile(__dirname+'/src/vote.html');
		}
	}	
		
	else 
		res.redirect('/invalid.html')
});

app.get('/admin.html',function(req,res) {
	let sess = req.session;
	console.log(sess.email)
	if(sess.email)
	{
		if(sess.admin == 'admin')
			res.sendFile(__dirname+'/src/admin.html');
		else 
			res.redirect('/noAdmin.html');
	}
	else	
		res.redirect('/invalid.html');
});

app.get('/addCandidate.html',function(req,res) {
	let sess = req.session;
	console.log(sess.email);
	if(sess.email)
		res.sendFile(__dirname+'/addCandidate.html');
	else 
		res.redirect('/invalid.html');
})

app.get('/invalid.html',function(req,res) {
	res.sendFile(__dirname+'/src/invalid.html');
});

app.get('/delete.html',function(req,res) {
	console.log('In Delete');
	req.session.destroy();
})

app.get('/noAdmin.html',function(req,res) {
	res.sendFile(__dirname+'/src/noAdmin.html');
});