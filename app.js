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
    console.log(count);

    //This works with postman
    if (column == undefined && count == undefined) {
      var column = req.body.fields.sortBy;
      var count = req.body.fields.count;
    } 

    var dbRef = firebase.database().ref('People/');
    
    dbRef.orderByChild(column).limitToFirst(count).on("value", function(data) {
      // console.log(data.val());
      data.forEach(function(data) {
        data_set.push(data.val());
    });
    res.send(data_set);
      }, function(error) {
            if (error) console.log(error);
            else console.log("No error");
            console.log("Donee");
      });
});

/*
  General search for the table
*/
app.post('/search', (req, res) => {
  var general_search = req.body.fields.general_search;

  // Modify the first character of the name to be uppercase and append the rest of the string
  general_search = general_search.charAt(0).toUpperCase() + general_search.slice(1);
  
  //Begin by searching through the first name field
  var dbRef = firebase.database().ref('People').orderBChild('firstLast').startAt(general_search).endAt(general_search+"\uf8ff");
  dbRef.on('value', snap => {
    var search_one = snap.val();

    //Now filter through the array

    //Check if the search matches any names in reverse
    var dbRef = firebase.database().ref('People').orderByChild('Full_Name_Reverse').startAt(general_search).endAt(general_search+"\uf8ff");
    dbRef.on('value', snap => {
      var search_two = snap.val();
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

app.post('/advancedSearch', (req, res) => {
  var firstName = req.body.fields.firstName;
  var lastName = req.body.fields.lastName;
  var sector = req.body.fields.sector;
  var employer = req.body.fields.employer;
  var province = req.body.fields.province;
  var salarayStart = req.body.fields.salarayRange.starting;
  var salarayEnd = req.body.fields.salarayRange.ending;
  var yearSart = req.body.fields.year.starting;
  var yearEnd = req.body.fields.year.ending;

  console.log(firstName);
  /*
    Query databse and get results.
    Send results.
  */
  res.json({testString:'testing return for advanced search.'});
});

// app.get('/writeToDatabase', function(req , res){
//   for (i in people_to_add) {
//     var person = people_to_add[i];
//     firebase.database().ref('People/'+person.LastName+'_'+person.FirstName).set(
//       person
//     );
//   }
// }
// });

app.listen(portNum);
console.log('Running app at localhost: ' + portNum);