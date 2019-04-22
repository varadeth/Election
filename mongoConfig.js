var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";

MongoClient.connect(url,function(err,db) {
    if(err) throw err;
    var dbo = db.db("E-Voting");
    var users = [
        {username:"varadeth",password:"varadeth",email:"varadetejas@gmail.com",type:"admin"},
        {username:"patilpp",password:"patilpp",email:"priyadarshanipatil749@gmail.com",type:"admin"},
        {username:"unhalesp",password:"unhalesp",email:"unhalesp35@gmail.com",type:"user"},
        {username:"mahajanvv",password:"mahajanvv",email:"vinitmahajan1@gmail.com",type:"user"},
    ]
    dbo.collection("login").insertMany(users,function(err,res) {
        if(err) throw err;
        console.log("Inserted");
        db.close();
    });
})