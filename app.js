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

/*
  General search for the table
*/
app.post('/search', (req, res) => {
  var general_search = req.body.fields.general_search;

  // Modify the first character of the name to be uppercase and append the rest of the string
  general_search = general_search.charAt(0).toUpperCase() + general_search.slice(1);
  
  //Begin by searching through the first name field
  var dbRef = firebase.database().ref('People').orderByChild('Full_Name').startAt(general_search).endAt(general_search+"\uf8ff");
  dbRef.on('value', snap => {
    var search_one = snap.val();

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


// Writing to the Database
// Writing to the Database example
//Sample Set of Data
// var people = [  
//   {"Sector":"Colleges","LastName":"Abiscott","FirstName":"Alexa","Full_Name":"Alexa_Abiscott","Full_Name_Reverse":"Abiscott_Alexa","SalaryPaid":"$197,073.24","Taxable Benefits":"$2,033.69","Employer":"Sheridan College Institute of Technology and Advanced Learning","Job Title":"General Counsel And Information Privacy Officer","Calendar Year":"2017"},
//   {"Sector":"Colleges","LastName":"Ahn","FirstName":"Song Ho","Full_Name":"Song_Ho_Ahn","Full_Name_Reverse":"Ahn_Song_Ho","SalaryPaid":"$114,331.63","Taxable Benefits":"$51.57","Employer":"Sheridan College Institute of Technology and Advanced Learning","Job Title":"Visualization Researcher - Part-Time Faculty","Calendar Year":"2017"}
//   // {"Sector":"Colleges","LastName":"smaAhnna","FirstName":"Song Ho","SalaryPaid":"$114,331.63","Taxable Benefits":"$51.57","Employer":"Sheridan College Institute of Technology and Advanced Learning","Job Title":"Visualization Researcher - Part-Time Faculty","Calendar Year":"2017"},
//   // {"Sector":"Colleges","LastName":"Aitken","FirstName":"Sharon","Salary Paid":"$118,650.76","Taxable Benefits":"$1,250.00","Employer":"Sheridan College Institute of Technology and Advanced Learning","Job Title":"Director Development and Campaign","Calendar Year":"2017"},
//   // {"Sector":"Colleges","LastName":"Ali","FirstName":"Shirook","Salary Paid":"$104,398.32","Taxable Benefits":"$101.50","Employer":"Sheridan College Institute of Technology and Advanced Learning","Job Title":"Professor","Calendar Year":"2017"},
//   // {"Sector":"Colleges","LastName":"Allcott","FirstName":"Austin Micha","Salary Paid":"$124,307.70","Taxable Benefits":"$1,264.54","Employer":"Sheridan College Institute of Technology and Advanced Learning","Job Title":"Dean","Calendar Year":"2017"} 
// ]; 

// Send a list to add it to the master
// writeSet(people);

// function writeSet(people_to_add) {
//   for (i in people_to_add) {
//     var person = people_to_add[i];
//     firebase.database().ref('People/'+person.LastName+'_'+person.FirstName).set(
//       person
//     );
//   }
// }

app.listen(portNum);
console.log('Running app at localhost: ' + portNum);