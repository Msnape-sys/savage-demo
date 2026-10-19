const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
require('dotenv').config(); // read .env file - needs to run before using process.env.Cxn_str
const mongoConnect = process.env.CONNECTION_STRING;
const {MongoClient, ObjectId} = require('mongodb');
const dbName = process.env.DB_NAME;
const port = process.env.PORT || 3000;
let db;

// middleware
app.set('view engine', 'ejs') //  tells express we're using ejs template
app.use(express.static('public')) // tells express to make 'public' folder accessible to the public by using built-in middleware called express.static
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true})) // bodyParser lets us parse all the data sent w/ ea. request--- along w/ req is all the form info 
//app.use(bodyParser.json()) // bodyParser and urlencoded, are now built into express

// app.get retreives msgs from MongoDB and displays them

/**  ---------GET, POST, PUT, DELETE = ACTUAL PROGRAMMING API--*/
app.get('/', (req, res) => {
  db.collection('messages')
  .find()
  .toArray()
  .then(results => {
    console.log(results);
    res.render('index.ejs',{messages: results});
  })
  .catch(error => console.error(error));
});

app.post('/messages', (req, res) => {
  db.collection('messages') // db: the mongo database app is connected to .collection('messages'): selects collection named messages
  .insertOne({
    name: req.body.name,
  msg: req.body.msg, // creates new doc in that collection using data inside the object
  thumbUp: 0,
  thumbDown:0
})
.then(result => {
  console.log('saved to database')
  res.redirect('/');
  })
  .catch(error => console.error(error));
});

app.put('/messages/thumbs-up', (req, res) => {
 console.log('thumbsUP req:',req.body);
  db.collection('messages')
  .findOneAndUpdate(
    { _id: new ObjectId(req.body.id)}, 
   // set is a mongoDB oprator. it saves the count # as the docs new thumbUP value, its then displayed in browser vie EJS 
    {$inc: {thumbUp: 1}},//thumbUp count increases in DB
   {sort: {_id: -1}}
    //upsert: true // mongoDB can create a new document when no existing doc matches filter
  )
  .then(result => {
  console.log('saved to database');
  res.redirect('/');
  })
  .catch(error => console.error(error));
});
  

// thumbsdown Put request 
app.put('/messages/thumbs-down', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate(
     {thumbUp:{$gt:0} , _id: new ObjectId(req.body.id)}, 
    { $inc: { thumbUp: -1 }}, 
    { sort: {_id: -1}}
  )
  .then(result => {
  console.log('saved to database');
  res.redirect('/');
  })
  .catch(error => console.error(error));
});

app.delete('/messages', (req, res) => {
  db.collection('messages')
  .findOneAndDelete({
    name: req.body.name, 
    msg: req.body.msg}) 
      .then(result => {
  console.log('saved to database');
  res.redirect('/');
  })
  .catch(error => console.error(error))
});
// Using promise chain to initialize server so that DB can connect before requsts are taken 

MongoClient.connect(mongoConnect)
.then(client => {
  console.log(`connected to database`)
  db = client.db(dbName);
app.listen(port, ()=> {
  console.log('Connected to demo');
});
})
.catch(error =>{
console.error('Could not connect to MongoDB')

});
