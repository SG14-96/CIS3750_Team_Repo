//----------------- Node Include -----------------------
var express = require('express');
var path = require('path');


// ---------- FIREBASE setup  ---------
var FireBaseAdmin = require('firebase-admin');
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

app.get('/search', (req, res) => {
   res.json({testString:'testing return for search call.'});
});

app.get('/advancedSearch', (req, res) => {
   res.json({testString:'testing return for advanced search.'});
});

app.get('/getSalaryInformation', (req, res) => {
  console.log("Get\n");
   res.send({
     name:'John Smith',
     sector:'Energy',
     salary:156000,
     year: 2018,
     province:'Ontario'
   });
});

app.listen(portNum);
console.log('Running app at localhost: ' + portNum);