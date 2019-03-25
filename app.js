//----------------- Node Include -----------------------
var express = require('express');
var path = require('path');

// ---------- FIREBASE setup  ---------
var FireBaseAdmin = require('firebase-admin');
var firebase = require("firebase");

// Initialize Firebase Connection
// Account set up with Samuel Denton email
var config = {
  apiKey: "AIzaSyDATMWUh4_jSt86UME41RdOxrhnFcVqlHc",
  authDomain: "salarydata-f161b.firebaseapp.com",
  databaseURL: "https://salarydata-f161b.firebaseio.com",
  projectId: "salarydata-f161b",
  storageBucket: "salarydata-f161b.appspot.com",
  messagingSenderId: "980571034893"
};
firebase.initializeApp(config);

// ----------------- Application ----------------------------
var app = express();

const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Important, pass in port as in `npm run dev 1234`, do not change
const portNum = process.argv[2];
// Send HTML at root, do not change
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});
app.get('/aboutUs',function(req,res){
  res.sendFile(path.join(__dirname+'/public/aboutUs.html'));
});
app.get('/contactUs',function(req,res){
  res.sendFile(path.join(__dirname+'/public/contactUs.html'));
});
app.get('/HowItWorks',function(req,res){
  res.sendFile(path.join(__dirname+'/public/HowItWorks.html'));
});
app.get('/img/logo.png',function(req,res){
  res.sendFile(path.join(__dirname+'/public/img/logo.png'));
});
app.get('/img/facebookLogo.png',function(req,res){
  res.sendFile(path.join(__dirname+'/public/img/facebookLogo.png'));
});
app.get('/img/instagramLogo.jpg',function(req,res){
  res.sendFile(path.join(__dirname+'/public/img/instagramLogo.jpg'));
});
app.get('/img/statisticalAnalysisFormulas.jpg',function(req,res){
  res.sendFile(path.join(__dirname+'/public/img/statisticalAnalysisFormulas.jpg'));
});
app.get('/img/teamImage.jpg',function(req,res){
  res.sendFile(path.join(__dirname+'/public/img/teamImage.jpg'));
});
app.get('/img/twitterLogo.png',function(req,res){
  res.sendFile(path.join(__dirname+'/public/img/twitterLogo.png'));
});

// Send Style, do not change
app.get('/style.css',function(req,res){
  //Feel free to change the contents of style.css to prettify your Web app
  res.sendFile(path.join(__dirname+'/public/style.css'));
});

// Send obfuscated JS, do not change
app.get('/index.js',function(req,res){
  fs.readFile(path.join(__dirname+'/public/index.js'), 'utf8', function(err, contents) {
    const minimizedContents = JavaScriptObfuscator.obfuscate(contents, {compact: true, controlFlowFlattening: true});
    res.contentType('application/javascript');
    res.send(minimizedContents._obfuscatedCode);
  });
});

// Firebase Functions

// Read the entire database
app.get('/getSalaryInformation', function(req , res){
    
    var data_set = [];
    var data_set_2 = [];

    //This works with the front end call but not via postman
    var column = req.query.sortBy;
    var count = parseInt(req.query.count);

    //This works with postman
    // if (column == undefined && count == undefined) {
    //   var column = req.body.fields.sortBy;
    //   var count = req.body.fields.count;
    // } 

    var dbRef = firebase.database().ref('People/');
    
    dbRef.orderByChild(column).
    limitToFirst(count).on("value", function(data) {
        data.forEach(function(data) {
          data_set.push(data.val());
        });
        res.send(data_set);    
    });
});

/*
  General search for the table
*/
app.get('/search', (req, res) => {
  console.log("General");
  //This works with the front end call but not via postman
  var general_search = req.query.general_search;
  
  // This works with postman
  if (general_search == undefined) {
    // general_search = req.body.fields.general_search;
  }


  var dbRef = firebase.database().ref('People/');
  var search_one, search_two = [];

  dbRef.orderByChild('firstLast').startAt(general_search).
  endAt(general_search+"\uf8ff").on('value', snap => {
    search_one = snap.val();

    dbRef.orderByChild('lastFirst').startAt(general_search).
    endAt(general_search+"\uf8ff").on('value', snap => {
        search_two = snap.val();
        res.json(mergeObjects(search_one,search_two)); 
      });
  });
});

function mergeObjects(a, b) {
  if (a == undefined && b == undefined) return [];
  if (a == undefined) return b;
  if (b == undefined) return a;
  return Object.assign(a, b);
}

app.get('/advancedSearch', (req, res) => {

  var firstName = req.body.query.firstName;
  var lastName = req.body.query.lastName;
  var sector = req.body.query.sector;
  var employer = req.body.query.employer;
  var province = req.body.query.province;
  var salaryStart = req.body.query.salaryRange.starting;
  var salaryEnd = req.body.query.salaryRange.ending;
  var yearStart = req.body.query.year.starting;
  var yearEnd = req.body.query.year.ending;

  var DB = firebase.database().ref().child('People').limitToFirst(200);
  var dataSet = [];
  DB.on('value',snap =>{
    dataSet = snap.val();
    if (firstName != null) {
      dataSet = dataSet.filter(function(data){
        return data.firstName === firstName;
      });
    }
    if (lastName != null) {
      dataSet = dataSet.filter(function(data){
        return data.lastName === lastName;
      });
    }
    if (sector != null) {
      dataSet = dataSet.filter(function(data){
        return data.sector === sector;
      });
    }
    if (employer != null) {
      dataSet = dataSet.filter(function(data){
        return data.employer === employer;
      });
    }
    if (province != null) {
      dataSet = dataSet.filter(function(data){
        return data.province === province;
      });
    }
    if (salaryStart != null) {
      dataSet = dataSet.filter(function(data){
        return data.salary >= salaryStart;
      });
    }
    if (salaryEnd != null) {
      dataSet = dataSet.filter(function(data){
        return data.salary <= salaryStart;
      });
    }
    if (yearStart != null) {
      dataSet = dataSet.filter(function(data){
        return data.year >= yearStart;
      });
    }
    if (yearEnd != null) {
      dataSet = dataSet.filter(function(data){
        return data.year <= yearEnd;
      });
    }
  });
  res.json(dataSet);
});

app.get('/update_record_select', (req, res) => {
  //This works with the front end call but not via postman
  var record_to_update = req.query.toUpdate;
  var action = parseInt(req.query.selct);

  // var record_to_update = req.body.fields.toUpdate;
  // var action = req.body.fields.select

  console.log(action);

  var dbRef = firebase.database().ref('People/')

  dbRef.orderByChild('firstLast').equalTo(record_to_update).on('value', snap => {
    console.log(snap.val());
    var update = snap.val();
    update.selected = action;
    var id = snap.key;

    firebase.database().ref("People/"+id).
    update(update, function(err) {
      res.send();
      
    });
  });


});

app.listen(portNum);
console.log('Running app at localhost: ' + portNum);