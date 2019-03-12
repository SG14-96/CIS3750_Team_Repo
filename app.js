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

/*
var serviceAccount = require('path/to/serviceAccountKey.json'); // make sure that the file exists and the account is activated.

FireBaseAdmin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com' // TODO: Chnage <<DATABASE_NAME>> to the real dataabse name.
});

FireBaseAdmin.initializeApp({
  credential: admin.credential.cert({
    projectId: '<PROJECT_ID>',
    clientEmail: 'foo@<PROJECT_ID>.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\n<KEY>\n-----END PRIVATE KEY-----\n'
  }),
  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});
*/
// ----------------- Application ----------------------------
var app = express();

const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Important, pass in port as in `npm run dev 1234`, do not change
const portNum = process.argv[2];

// Send HTML at root, do not change
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

// Send Style, do not change
app.get('/style.css',function(req,res){
  //Feel free to change the contents of style.css to prettify your Web app
  // res.sendFile(path.join(__dirname+'/public/style.css'));
});

// Send obfuscated JS, do not change
app.get('/index.js',function(req,res){
  fs.readFile(path.join(__dirname+'/public/index.js'), 'utf8', function(err, contents) {
    const minimizedContents = JavaScriptObfuscator.obfuscate(contents, {compact: true, controlFlowFlattening: true});
    res.contentType('application/javascript');
    res.send(minimizedContents._obfuscatedCode);
  });
});

app.get('/search', (req, res) => {
   res.json({testString:'testing return for search call.'});
});

app.get('/advancedSearch', (req, res) => {
   res.json({testString:'testing return for advanced search.'});
   res.json(search_for_individuals_option(first));
});

// app.get('/getSalaryInformation', (req, res) => {
//    res.json({
//      name:'John Smith',
//      sector:'Energy',
//      salary:156000,
//      year: 2018,
//      province:'Ontario'
//    });
// });

// Firebase Functions

// Read the entire database
app.get('/getSalaryInformation', function(req , res){
  
  var data_set = []
  var dbRef = firebase.database().ref().child('People');
  
  dbRef.on('value', snap => {
    data_set = snap.val();
    console.log("Inside");
    console.log(data_set);
    res.send(data_set);
  });

});

// Writing to the Database example
//Sample Set of Data
var people = [
  { id: "John_Smith", name: "Johnny", last: "Smith" },
  { id: "Samuel_Smith", name: "Samuel", last: "Smith" }
];

writeSet(people);

function writeSet(people_to_add) {
    for (i in people_to_add) {
      var person = people_to_add[i];
      console.log(person);
      writeData(person.id, person.name, person.last);
    }
}

function writeData(id, first, last_name) {
    firebase.database().ref('People/Employee_'+id).set({
      First: first,
      Last: last_name
    });
}


function search_for_individuals_option(first_name)
{
  var returned_set = [];

  // Firebase call
  var dbRef = firebase.database().ref('People').orderByChild('First').equalTo(first_name);
  dbRef.on('value', snap => {
    returned_set = snap.val();

    //More advance search if more then one field
    for (i in returned_set)
    { 
      console.log(returned_set[i]);
    }

  });
  return search_results;
}

app.listen(portNum);
console.log('Running app at localhost: ' + portNum);