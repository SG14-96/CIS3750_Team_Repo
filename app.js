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
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Important, pass in port as in `npm run dev 1234`, do not change
const portNum = process.argv[2];
// Send HTML at root, do not change
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
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

app.post('/search', (req, res) => {
  var firstName = req.body.fields.firstName;
  var lastName = req.body.fields.lastName;
  var general_search = req.query.general_search_input;
  console.log("Searching");

  //Begin by searching through the first name field
  var dbRef = firebase.database().ref('People').orderByChild('FirstName').startAt(general_search).endAt("abc\uf8ff");
  dbRef.on('value', snap => {
    var firstName_set = snap.val();
    //If only one name is provided search through last names wiith same value
    var dbRef = firebase.database().ref('People').orderByChild('LastName').startAt(general_search).endAt("abc\uf8ff");
    dbRef.on('value', snap => {
      var lastName_set = snap.val();      
      console.log(mergeObjects(firstName_set, lastName_set));
    });    
  });
});

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

  var paramsMap = new Map();
  paramsMap.set("FirstName",firstName);
  paramsMap.set("FirstName",firstName);
  paramsMap.set("Sector",sector);
  paramsMap.set("Employer",employer);
  paramsMap.set("Province",province);
  paramsMap.set("SalaryPaid",salarayStart);
  paramsMap.set("CalendarYear",yearSart);
  
  var DB = firebase.database().ref().child('People');
  var dataSet = [];
  DB.on('value',snap =>{
    dataSet = snap.val();
     res.json(dataSet);
  });
  for (var [key, value] of paramsMap) {
    if (value != null) {
      //
    }
  }
});

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
/*
var people = [
  { id: "John_Smith", name: "Johnny", last: "Smith" },
  { id: "Samuel_Smith", name: "Samuel", last: "Smith" }
];

writeSet(people);


function writeSet(people_to_add) {
  for (i in people_to_add) {
    var person = people_to_add[i];
    firebase.database().ref('People/'+person.LastName+'_'+person.FirstName).set(
      person
    );
  }
}
*/
app.listen(portNum);
console.log('Running app at localhost: ' + portNum);